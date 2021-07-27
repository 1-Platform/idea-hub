import { CreateVoteDoc, DesignDoc, IdeaDoc } from 'pouchDB/types';

export class VoteModel {
  _db: PouchDB.Database;
  constructor(db: PouchDB.Database) {
    this._db = db;
  }

  /**
   * map/reduce is used to get the aggregated result of votes for an idea.
   * By design this will always have unique votes and keeps the count valid always
   */
  async updateTotalVotesOfAnIdea(ideaId: string): Promise<PouchDB.Core.Response> {
    const { rows } = await this._db.query(DesignDoc.CountOfVotesForAnIdea, {
      reduce: true,
      group: true,
      key: ideaId,
    });
    const fetchIdea = await this._db.get<IdeaDoc>(ideaId);
    fetchIdea.votes = rows.length === 1 ? rows[0].value : 0;
    return this._db.put(fetchIdea);
  }

  async createVote(ideaId: string): Promise<PouchDB.Core.Response> {
    const { rhatUUID } = window.OpAuthHelper.getUserInfo();
    const timestamp = new Date().getTime();

    await this._db.put<CreateVoteDoc>({
      _id: `vote:${ideaId}:${rhatUUID}`,
      createdAt: timestamp,
      ideaId,
      type: 'vote',
    });
    return this.updateTotalVotesOfAnIdea(ideaId);
  }

  /**
   * delete is not using pouchdb delete command because doc wont be available in change event emitter
   * same function is done by added _deleted on update, which gives back doc in onChange in delete
   */
  async deleteVote(ideaId: string): Promise<PouchDB.Core.Response> {
    const { rhatUUID } = window.OpAuthHelper.getUserInfo();
    const voteId = `vote:${ideaId}:${rhatUUID}`;
    const voteDoc = await this._db.get(voteId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (voteDoc as any)._deleted = true;
    await this._db.put(voteDoc);
    return this.updateTotalVotesOfAnIdea(ideaId);
  }
}
