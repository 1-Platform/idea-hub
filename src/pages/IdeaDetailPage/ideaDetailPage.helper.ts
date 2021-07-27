import { IdeaModel } from 'pouchDB/api/idea';
import { IdeaDoc } from 'pouchDB/types';

export const onIdeaChange = async (
  doc: PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>,
  idea: IdeaModel
): Promise<PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>> => {
  const formatDoc = await idea.formatIdea(doc); // adds whether user has voted for this idea
  return formatDoc;
};
