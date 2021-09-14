import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import pouchdbHTTPAdapter from 'pouchdb-adapter-http';
import dotenv from 'dotenv';
dotenv.config();

import { POUCHDB_DB_URL } from '../src/pouchDB/config';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(pouchdbHTTPAdapter);

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
