export const POUCHDB_DB_NAME = process.env.POUCHDB_DB_NAME || 'idea-hub';

const indexDetails = [
  {
    index: {
      fields: ['type', 'votes', 'authorId'],
      name: 'type-votes-author-index',
      ddoc: 'type-votes-author-index',
    },
  },
  {
    index: {
      fields: ['type', '_id', 'authorId'],
      name: 'type-id-author-index',
      ddoc: 'type-id-author-index',
    },
  },
  {
    index: {
      fields: ['type', 'ideaId', 'votes'],
      name: 'type-ideaId-votes-index',
      ddoc: 'type-ideaId-votes-index',
    },
  },
];

export const pouchDBIndexCreator = async (db: PouchDB.Database): Promise<void> => {
  try {
    indexDetails.map(async (el) => {
      await db.createIndex(el);
    });
  } catch (error) {
    console.error(error);
  }
  return;
};
