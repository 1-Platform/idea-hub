import { DesignDoc, TagDoc } from '../types';

export class TagModel {
  _db: PouchDB.Database;
  constructor(db: PouchDB.Database) {
    this._db = db;
  }

  async getTagList(limit = 10): Promise<PouchDB.Find.FindResponse<Record<string, unknown>>> {
    return this._db.find({
      selector: {
        type: 'tag',
      },
      limit,
    });
  }

  /**
   * We are using couchdb unique idas as a property to create tag names
   * So by default all tags will always be unique
   */
  async createNewTags(tags: string[]): Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[]> {
    const timestamp = new Date().getTime();
    const tagsToBeCreated = tags.map((tagName) => ({
      _id: tagName.toLowerCase(),
      createdAt: timestamp,
      type: 'tag',
    }));

    return this._db.bulkDocs(tagsToBeCreated);
  }

  /**
   * By map/reduce of couchdb we build the result of tags vs used aggregated result
   * This is memory sorted to showcase
   */
  async getTagCounts(): Promise<PouchDB.Query.Response<TagDoc>> {
    const tags = await this._db.query<TagDoc>(DesignDoc.CountOfTagsUsed, {
      reduce: true,
      group: true,
    });
    return tags;
  }
}
