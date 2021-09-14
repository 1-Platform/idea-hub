/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef } from 'react';

import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import pouchdbDebug from 'pouchdb-debug';
import pouchdbHTTPAdapter from 'pouchdb-adapter-http';

import { pouchDBIndexCreator, POUCHDB_DB_NAME, POUCHDB_DB_URL } from 'pouchDB/config';
import { IdeaModel } from 'pouchDB/api/idea';
import { TagModel } from 'pouchDB/api/tag';
import { PouchDBConsumer } from './types';
import { VoteModel } from 'pouchDB/api/vote';
import { pouchDBDesignDocCreator } from 'pouchDB/design';
import { CommentModel } from 'pouchDB/api/comments';
import { DesignDoc } from 'pouchDB/types';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(pouchdbDebug);
PouchDB.plugin(pouchdbHTTPAdapter);
PouchDB.debug.enable('pouchdb:find');
const PouchDBContext = createContext<PouchDBConsumer | null>(null);

interface Props {
  children: ReactNode;
}

export const PouchDBProvider = ({ children }: Props): JSX.Element => {
  const db = useRef(new PouchDB(POUCHDB_DB_NAME, { auto_compaction: true }));
  const remoteDb = useRef(
    new PouchDB(POUCHDB_DB_URL, {
      skip_setup: true,
      auto_compaction: true,
      fetch: function (url, opts) {
        if (opts) {
          (opts?.headers as any).set('Authorization', `Bearer ${window?.OpAuthHelper?.jwtToken}`);
          opts.credentials = 'omit';
        }
        return PouchDB.fetch(url, opts);
      },
    } as PouchDB.Configuration.RemoteDatabaseConfiguration)
  );
  const idea = useRef(new IdeaModel(db.current));
  const tag = useRef(new TagModel(db.current));
  const vote = useRef(new VoteModel(db.current));
  const comment = useRef(new CommentModel(db.current));
  // to sync with couch database onMount
  useEffect(() => {
    db.current.sync(remoteDb.current, {
      retry: true,
      live: true,
      filter: DesignDoc.ReplicationFilter,
    });
    pouchDBIndexCreator(db.current);
    pouchDBDesignDocCreator(db.current);
  }, []);

  const onDocChange = (
    onChange: (value: PouchDB.Core.ChangesResponseChange<any>) => any,
    onError: (value: any) => any
  ) => {
    return db.current
      .changes({ live: true, since: 'now', include_docs: true })
      .on('change', onChange)
      .on('error', onError);
  };

  const value = useMemo<PouchDBConsumer>(
    () => ({
      db: db.current,
      idea: idea.current,
      tag: tag.current,
      vote: vote.current,
      comment: comment.current,
      onDocChange,
    }),
    []
  );

  return <PouchDBContext.Provider value={value}>{children}</PouchDBContext.Provider>;
};

export const usePouchDB = (): PouchDBConsumer => {
  const context = useContext(PouchDBContext);
  if (!context) {
    throw Error('Missing provider for pouchdb-context');
  }
  return context;
};
