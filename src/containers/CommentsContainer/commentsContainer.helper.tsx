import { CommentModel } from 'pouchDB/api/comments';
import { CommentDoc } from 'pouchDB/types';
import { binarySearchOfPouchDbDocs } from 'utils/binarySearch';

export const onCommentChange = async (
  doc: PouchDB.Core.ExistingDocument<CommentDoc & PouchDB.Core.AllDocsMeta>,
  commentList: PouchDB.Core.ExistingDocument<CommentDoc & PouchDB.Core.AllDocsMeta>[],
  comment: CommentModel
): Promise<PouchDB.Core.ExistingDocument<CommentDoc & PouchDB.Core.AllDocsMeta>[]> => {
  const newCommentList = [...commentList];
  const changedCommentPos = binarySearchOfPouchDbDocs(newCommentList, doc._id);
  const formatedDoc = await comment.formatComment(doc);
  if (
    changedCommentPos === -1 &&
    (newCommentList.length === 0 || doc._id.localeCompare(newCommentList?.[0]?._id) === 1)
  ) {
    newCommentList.unshift(formatedDoc);
  } else if (changedCommentPos !== -1) {
    newCommentList[changedCommentPos] = formatedDoc;
  }
  return newCommentList;
};
