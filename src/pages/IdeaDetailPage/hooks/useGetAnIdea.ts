import { ideaDoc } from 'pouchDB';
import { IdeaDoc } from 'pouchDB/types';
import useSWR, { KeyedMutator } from 'swr';

type Props = {
  id: string;
};

type UseGetIdeaListReturn = {
  idea?: PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>;
  isIdeaLoading: boolean;
  mutateIdea: KeyedMutator<PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>>;
};

const fetchIdeaDetails = async (
  id: string
): Promise<PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta> | undefined> => {
  try {
    const ideaDetailsFetched = await ideaDoc.getAnIdeaById(id);
    return ideaDetailsFetched;
  } catch (error) {
    console.error(error);
    window.OpNotification.danger({
      subject: 'Error while loading ideas',
      body: error.message,
    });
  }
};

export const useGetAnIdea = ({ id }: Props): UseGetIdeaListReturn => {
  const {
    data: idea,
    mutate: mutateIdea,
    error,
  } = useSWR(
    [`/ideas/${id}`, id],
    async (
      _,
      ideaId
    ): Promise<PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>> => {
      return new Promise((resolve) => {
        window.OpAuthHelper.onLogin(async () => {
          const ideaDetails = await fetchIdeaDetails(ideaId);
          if (ideaDetails) {
            return resolve(ideaDetails);
          }
        });
      });
    },
    { revalidateOnFocus: false }
  );

  const isIdeaLoading = !idea && !error;

  return {
    idea,
    isIdeaLoading,
    mutateIdea,
  };
};
