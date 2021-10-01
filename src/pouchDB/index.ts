import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import pouchdbDebug from 'pouchdb-debug';

import { POUCHDB_DB_URL } from './config';

import { IdeaModel } from './api/idea';
import { CommentModel } from './api/comments';
import { TagModel } from './api/tag';
import { VoteModel } from './api/vote';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(pouchdbDebug);
PouchDB.debug.enable('pouchdb:find');

// export const db = new PouchDB(POUCHDB_DB_NAME, { auto_compaction: true });
export const remoteDb = new PouchDB(POUCHDB_DB_URL, {
  skip_setup: true,
  auto_compaction: true,
  fetch: function (url, opts) {
    if (opts) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (opts?.headers as any).set('Authorization', `Bearer ${window?.OpAuthHelper?.jwtToken}`);
      opts.credentials = 'omit';
    }
    return PouchDB.fetch(url, opts);
  },
});

export const ideaDoc = new IdeaModel(remoteDb);
Object.freeze(ideaDoc);

export const commentDoc = new CommentModel(remoteDb);
Object.freeze(commentDoc);

export const tagDoc = new TagModel(remoteDb);
Object.freeze(tagDoc);

export const voteDoc = new VoteModel(remoteDb);
Object.freeze(voteDoc);
