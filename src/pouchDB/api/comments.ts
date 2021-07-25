import {
  CommentDoc,
  CreateCommentDoc,
  DesignDoc,
  GetCommentListArg,
  GetList,
  IdeaDoc,
  IndexDoc,
  LikeDoc,
} from 'pouchDB/types';

export class CommentModel {
  _db: PouchDB.Database;
  constructor(db: PouchDB.Database) {
    this._db = db;
  }

  // same priciple as idea.ts getIdeaListByRecent
  async getCommentListByRecent({
    ideaId,
    startKey,
    limit = 20,
    skip = 0,
  }: GetCommentListArg): Promise<GetList<CommentDoc>> {
    const comments = (await this._db.find({
      limit,
      skip,
      selector: {
        type: 'comment',
        _id: {
          $gt: `comment:${ideaId}:`,
          $lte: startKey || `comment:${ideaId}:\uffff`,
        },
      },
      sort: [{ type: 'desc' }, { _id: 'desc' }],
      use_index: IndexDoc.SortedByTypeIdAuthor,
    })) as PouchDB.Find.FindResponse<CommentDoc>;

    const userLikedComments = await this.hasUserLikedInComments(comments.docs);
    const lastDocId = userLikedComments[userLikedComments.length - 1]?._id;
    return {
      hasNextPage: Boolean(lastDocId),
      docs: userLikedComments,
      cb: async () => this.getCommentListByRecent({ limit, startKey: lastDocId, skip: 1, ideaId }),
    };
  }

  // same as getIdeaListByRecent in idea.ts
  async getCommentListByPopular({
    limit = 20,
    skip = 0,
    startKey,
    filter = {},
    ideaId,
  }: GetCommentListArg): Promise<GetList<CommentDoc>> {
    //filter set
    const selector: Record<string, unknown> = { type: 'comment', ideaId };
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
      sort: [{ type: 'desc' }, { ideaId: 'desc' }, { votes: 'desc' }],
      use_index: IndexDoc.SortedByTypeIdeaidVotes,
    })) as PouchDB.Find.FindResponse<CommentDoc>;

    const formatedIdeaListWithHasUserVotes = await this.hasUserLikedInComments(ideas.docs);
    const newStartKey = ideas.docs[ideas.docs.length - 1]?.votes;
    const isEndKeyEqStartKey = newStartKey === startKey;
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
        this.getCommentListByPopular({
          limit,
          startKey: newStartKey,
          skip: nextToBeSkipped,
          filter,
          ideaId,
        }),
    };
  }

  async formatComment(
    comment: PouchDB.Core.ExistingDocument<CommentDoc & PouchDB.Core.AllDocsMeta>
  ): Promise<PouchDB.Core.ExistingDocument<CommentDoc & PouchDB.Core.AllDocsMeta>> {
    const { rhatUUID } = window.OpAuthHelper.getUserInfo();
    try {
      await this._db.get<LikeDoc>(`like:${comment._id}:${rhatUUID}`);
      comment.hasLiked = true;
    } catch (error) {
      comment.hasLiked = false;
    }
    return comment;
  }

  async hasUserLikedInComments(
    comments: PouchDB.Core.ExistingDocument<CommentDoc>[]
  ): Promise<PouchDB.Core.ExistingDocument<CommentDoc & PouchDB.Core.AllDocsMeta>[]> {
    const { rhatUUID } = window.OpAuthHelper.getUserInfo();
    const idsOfComments = comments.map(({ _id }) => `like:${_id}:${rhatUUID}`);
    const likedComments = await this._db.allDocs<LikeDoc>({
      keys: idsOfComments,
      include_docs: true,
    });
    const userLikedComments: Record<string, boolean> = {};
    likedComments.rows.map(({ doc }) => {
      if (doc) userLikedComments[doc.commentId] = true;
    });

    const docs = comments.map((doc) => {
      if (doc) {
        doc.hasLiked = Boolean(doc?._id) && userLikedComments?.[doc._id];
      }
      return doc;
    }) as PouchDB.Core.ExistingDocument<CommentDoc & PouchDB.Core.AllDocsMeta>[];

    return docs;
  }

  async createComment(ideaId: string, content: string): Promise<PouchDB.Core.Response> {
    const { rhatUUID, fullName } = window.OpAuthHelper.getUserInfo();
    const timestamp = new Date().getTime();
    await this._db.put<CreateCommentDoc>({
      _id: `comment:${ideaId}:${timestamp}-${rhatUUID}`,
      createdAt: timestamp,
      type: 'comment',
      content,
      votes: 0,
      author: fullName,
      authorId: rhatUUID,
      ideaId,
    });
    return this.updateTotalCommentCountOfaAnIdea(ideaId);
  }

  async updateTotalCommentCountOfaAnIdea(ideaId: string): Promise<PouchDB.Core.Response> {
    const { rows } = await this._db.query(DesignDoc.CountOfCommentsForAnIdea, {
      reduce: true,
      group: true,
      key: ideaId,
    });
    const fetchIdea = await this._db.get<IdeaDoc>(ideaId);
    fetchIdea.comments = rows.length === 1 ? rows[0].value : 0;
    return this._db.put(fetchIdea);
  }

  async likeAComment(commentId: string): Promise<PouchDB.Core.Response> {
    const { rhatUUID } = window.OpAuthHelper.getUserInfo();
    const timestamp = new Date().getTime();
    await this._db.put({
      _id: `like:${commentId}:${rhatUUID}`,
      commentId,
      createdAt: timestamp,
      type: 'like',
    });
    return this.updateTotalLikesCountOfAComment(commentId);
  }

  async updateTotalLikesCountOfAComment(commentId: string): Promise<PouchDB.Core.Response> {
    const { rows } = await this._db.query(DesignDoc.CountOfLikesForAComment, {
      reduce: true,
      group: true,
      key: commentId,
    });

    const fetchedComment = await this._db.get<CommentDoc>(commentId);
    fetchedComment.votes = rows.length === 1 ? rows[0].value : 0;
    return this._db.put(fetchedComment);
  }

  async deleteLikeOfAComment(commentId: string): Promise<PouchDB.Core.Response> {
    const { rhatUUID } = window.OpAuthHelper.getUserInfo();
    const likeId = `like:${commentId}:${rhatUUID}`;
    const likeDoc = await this._db.get(likeId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (likeDoc as any)._deleted = true;
    await this._db.put(likeDoc);
    return this.updateTotalLikesCountOfAComment(commentId);
  }
}
