export const POUCHDB_DB_NAME = process.env.REACT_APP_POUCH_DB_NAME || 'ideahub';
export const POUCHDB_DB_URL = `${process.env.REACT_APP_POUCH_DB_URL}/${POUCHDB_DB_NAME}`;

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
    await Promise.all(
      indexDetails.map(async (el) => {
        await db.createIndex(el);
      })
    );
  } catch (error) {
    console.error(error);
  }
  return;
};
