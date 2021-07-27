import { CommentModel } from 'pouchDB/api/comments';
import { IdeaModel } from 'pouchDB/api/idea';
import { TagModel } from 'pouchDB/api/tag';
import { VoteModel } from 'pouchDB/api/vote';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type PouchDBConsumer = {
  db: PouchDB.Database;
  idea: IdeaModel;
  tag: TagModel;
  vote: VoteModel;
  comment: CommentModel;
  onDocChange: (
    onChange: (value: PouchDB.Core.ChangesResponseChange<any>) => any,
    onError: (value: any) => any
  ) => void;
};
