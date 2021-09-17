import PouchDB from 'pouchdb-node';
import PouchDBFind from 'pouchdb-find';
import dotenv from 'dotenv-safe';
dotenv.config({ path: '.env.local' });

import { POUCHDB_DB_URL } from '../src/pouchDB/config';

PouchDB.plugin(PouchDBFind);

export const db = new PouchDB(POUCHDB_DB_URL, {
  skip_setup: true,
  fetch: function (url, opts) {
    if (opts) {
      (opts?.headers as Headers).set('Authorization', `Bearer ${process.env.POUCH_DB_ADMIN_TOKEN}`);
      opts.credentials = 'omit';
    }
    return PouchDB.fetch(url, opts);
  },
} as PouchDB.Configuration.RemoteDatabaseConfiguration);
