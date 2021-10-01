import { CreateIdeaDoc, GetIdeaListArg, GetList, IdeaDoc, IndexDoc, VoteDoc } from 'pouchDB/types';
import { nanoid } from 'nanoid';

export class IdeaModel {
  _db: PouchDB.Database;
  constructor(db: PouchDB.Database) {
    this._db = db;
  }

  /**
   * When listing ideas by recent ones the utilized pagination is keyset based pagination
   * So basically its starts from top and bottom most point and limits docs based on limit parameter
   * The last limited id is saved and on next page the end points are shifted from the ended ones onwards
   * Here filters are applied based on author, category
   * Then an additonal call is made in bull to check user has voted
   */
  async getIdeaListByRecent({
    startKey = 'idea:\uffff',
    limit = 20,
    skip = 0,
    filter = {},
  }: GetIdeaListArg): Promise<GetList<IdeaDoc>> {
    // filters based on query parameters in URL
    const selector: Record<string, unknown> = {};
    filter?.author
      ? (selector['authorId'] = filter?.author)
      : (selector['authorId'] = { $gt: null });
    filter?.category ? (selector['tags'] = { $all: [filter?.category] }) : null;

    const ideas = (await this._db.find({
      limit,
      skip,
      selector: {
        _id: {
          $lte: startKey,
          $gt: 'idea:',
        },
        type: 'idea',
        ...selector,
      },
      sort: [{ type: 'desc' }, { _id: 'desc' }],
      use_index: IndexDoc.SortedByTypeIdAuthor,
    })) as PouchDB.Find.FindResponse<IdeaDoc>;
    const formatedIdeaListWithHasUserVotes = await this.hasUserVotedOn(ideas.docs);
    const lastDocId = ideas.docs[ideas.docs.length - 1]?._id;
    return {
      hasNextPage: Boolean(lastDocId),
      docs: formatedIdeaListWithHasUserVotes,
      cb: async () => this.getIdeaListByRecent({ limit, startKey: lastDocId, skip: 1, filter }),
    };
  }

  /**
   * When listing based on popular that is its listed based on votes. Here we can apply high performant
   * keyset pagination because vote is not unique. Two ideas can have same amount of votes.
   * So here we apply skip-limit pagination. To improve its performance a startkey is also applied
   * to decrease the skip effect drastically
   */
  async getIdeaListByPopular({
    limit = 20,
    skip = 0,
    startKey,
    filter = {},
  }: GetIdeaListArg): Promise<GetList<IdeaDoc>> {
    // filters based on selectors
    const selector: Record<string, unknown> = { type: 'idea' };
    selector['authorId'] = filter?.author ? filter?.author : { $gt: null };
    if (filter?.category) selector['tags'] = { $all: [filter?.category] };
    const isNotFirstPageLoad = startKey || startKey === 0;
    if (isNotFirstPageLoad) {
      selector.votes = { $lte: startKey };
    } else {
      selector.votes = { $gte: null };
    }

    const ideas = (await this._db.find({
      limit,
      skip,
      selector,
      sort: [{ type: 'desc' }, { votes: 'desc' }],
      use_index: IndexDoc.SortedByTypeVoteAuthor,
    })) as PouchDB.Find.FindResponse<IdeaDoc>;

    const formatedIdeaListWithHasUserVotes = await this.hasUserVotedOn(ideas.docs);

    /**
     * Here startkey is basically the lost fetched post vote
     * if it was having same value as previous startkey skip must consider all the previous found same vote
     * if it was not same, then skip must consider the first index of that vote in the list
     * Then skip is calculated based on that avoiding skip going too high
     * eg: [1,2,3,3] -> last-vote is 3 as its not first one,
     * newStartKey will be 3 with skip first index in list: 2
     * [1,1,1,1] -> last-vote is same as previous so skip will be previous skip + new list length
     */
    const newStartKey = ideas.docs[ideas.docs.length - 1]?.votes;
    const isEndKeyEqStartKey = newStartKey === startKey; // checking last-vote and starting one
    let nextToBeSkipped = skip;
    if (isEndKeyEqStartKey) {
      nextToBeSkipped = skip + limit;
    } else {
      nextToBeSkipped = ideas.docs.length - ideas.docs.findIndex((el) => el.votes === newStartKey);
    }

    return {
      hasNextPage: Boolean(ideas.docs[ideas.docs.length - 1]?._id),
      docs: formatedIdeaListWithHasUserVotes,
      cb: async () =>
        this.getIdeaListByPopular({ limit, startKey: newStartKey, skip: nextToBeSkipped, filter }),
    };
  }

  /**
   * used for formating, using bulk get we retrieve all the current user votes
   * for each of ideas list given
   * Vote id by design can be derived from idea-id and user-name/kerberos id
   */
  async hasUserVotedOn(
    ideas: PouchDB.Core.ExistingDocument<IdeaDoc>[]
  ): Promise<PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>[]> {
    const { rhatUUID } = window.OpAuthHelper.getUserInfo();
    const idsOfIdeasToBeVerified = ideas.map(({ _id }) => `vote:${_id}:${rhatUUID}`);

    const votedIdeas = await this._db.allDocs<VoteDoc>({
      keys: idsOfIdeasToBeVerified,
      include_docs: true,
    });
    const userVotedIdeas: Record<string, boolean> = {};
    votedIdeas.rows.map(({ doc }) => {
      if (doc) userVotedIdeas[doc.ideaId] = true;
    });
    const docs = ideas.map((doc) => {
      if (doc) {
        doc.hasVoted = doc?._id ? userVotedIdeas?.[doc._id] : false;
      }
      return doc;
    }) as PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>[];
    return docs;
  }

  async getAnIdeaById(
    ideaId: string
  ): Promise<PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta> | undefined> {
    const ideaDetails = (await this._db.find({
      selector: {
        type: 'idea',
        ideaId,
      },
      use_index: IndexDoc.SortedByTypeIdeaidVotes,
    })) as PouchDB.Find.FindResponse<IdeaDoc>;
    if (ideaDetails.docs.length !== 1) {
      return;
    }
    return this.formatIdea(ideaDetails.docs[0]);
  }

  /**
   * To add additional details of an idea on get like hasVoted etc
   */
  async formatIdea(
    idea: PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>
  ): Promise<PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>> {
    const { rhatUUID } = window.OpAuthHelper.getUserInfo();
    try {
      await this._db.get<VoteDoc>(`vote:${idea._id}:${rhatUUID}`);
      idea.hasVoted = true;
    } catch (error) {
      idea.hasVoted = false;
    }
    return idea;
  }

  async createNewIdea(newIdea: CreateIdeaDoc): Promise<PouchDB.Core.Response> {
    const timestamp = new Date().getTime();
    const { rhatUUID, fullName } = window.OpAuthHelper.getUserInfo();
    const ideaId = nanoid(6);
    const idea = {
      ...newIdea,
      _id: `idea:${timestamp}-${rhatUUID}`,
      author: fullName,
      authorId: rhatUUID,
      votes: 0,
      comments: 0,
      type: 'idea',
      createdAt: timestamp,
      updatedAt: timestamp,
      ideaId,
    };
    return this._db.put(idea);
  }

  async updateAnIdea(
    ideaId: string,
    { tags, title, description }: CreateIdeaDoc
  ): Promise<PouchDB.Core.Response> {
    const timestamp = new Date().getTime();
    const ideaDoc = await this._db.get<IdeaDoc>(ideaId);
    const newIdeaDoc = { ...ideaDoc, tags, title, description, updatedAt: timestamp };
    return await this._db.put(newIdeaDoc);
  }

  async toggleArchiveIdea(ideaId: string): Promise<boolean> {
    const timestamp = new Date().getTime();
    const idea = await this._db.get<IdeaDoc>(ideaId);
    idea.updatedAt = timestamp;
    idea.isArchived = !idea.isArchived;
    await this._db.put(idea);
    return idea.isArchived;
  }
}
