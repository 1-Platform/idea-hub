import { db } from './remote-pouch-db-instance';
import { pouchDBDesignDocCreator } from '../src/pouchDB/design';
import { pouchDBIndexCreator, POUCHDB_DB_URL } from '../src/pouchDB/config';

const buildDesignDocumentsOnCouchDB = async () => {
  console.log('Design document build started');
  console.log(`Pouchdb DB URL: ${POUCHDB_DB_URL}`);

  try {
    await pouchDBDesignDocCreator(db);
    await pouchDBIndexCreator(db);
    console.log('Completed building of design documents to couchdb');
  } catch (error) {
    console.error(error.message);
  }
};

buildDesignDocumentsOnCouchDB();
