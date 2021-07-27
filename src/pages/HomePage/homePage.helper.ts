import { IdeaModel } from 'pouchDB/api/idea';
import { IdeaDoc } from 'pouchDB/types';
import { binarySearchOfPouchDbDocs } from 'utils/binarySearch';

export const onIdeaChange = async (
  doc: PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>,
  ideaList: PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>[],
  idea: IdeaModel
): Promise<PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>[]> => {
  const newIdeaList = [...ideaList];
  const changedIdeaPos = binarySearchOfPouchDbDocs(newIdeaList, doc._id);
  const formatedDoc = await idea.formatIdea(doc);
  if (
    changedIdeaPos === -1 &&
    (newIdeaList.length === 0 || doc._id.localeCompare(newIdeaList?.[0]?._id) === 1)
  ) {
    newIdeaList.unshift(formatedDoc);
  } else if (changedIdeaPos !== -1) {
    newIdeaList[changedIdeaPos] = formatedDoc;
  }
  return newIdeaList;
};
