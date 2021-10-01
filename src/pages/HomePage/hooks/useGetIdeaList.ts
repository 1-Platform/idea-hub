import { ideaDoc } from 'pouchDB';
import { GetList, IdeaDoc } from 'pouchDB/types';
import { useEffect, useRef } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { Filter } from '../types';

type Props = {
  type: 'recent' | 'popular';
  author: string;
  category: string;
  limit: number;
};

type UseGetIdeaListReturn = {
  ideas?: GetList<IdeaDoc>;
  ideasRef: React.MutableRefObject<GetList<IdeaDoc> | undefined>;
  isIdeaListLoading: boolean;
  setIdeas: KeyedMutator<GetList<IdeaDoc>>;
};

export const handleFetchIdeaList = async (
  type: 'recent' | 'popular',
  filter: Filter,
  limit = 20
): Promise<GetList<IdeaDoc>> => {
  try {
    let ideaList: GetList<IdeaDoc> = { hasNextPage: true, docs: [] };
    if (type === 'popular') {
      ideaList = await ideaDoc.getIdeaListByPopular({ limit, filter });
    } else {
      ideaList = await ideaDoc.getIdeaListByRecent({ limit, filter });
    }
    return ideaList;
  } catch (error) {
    console.error(error);
  }
  return { hasNextPage: false, docs: [] };
};

export const useGetIdeaList = ({ type, author, category, limit }: Props): UseGetIdeaListReturn => {
  const {
    data: ideas,
    mutate,
    error,
  } = useSWR(
    [`/ideas?type=${type}&limit=${limit}`, type, author, category],
    async (_url, type, author, category): Promise<GetList<IdeaDoc>> => {
      return new Promise((resolve) => {
        window.OpAuthHelper.onLogin(async () => {
          const ideaList = await handleFetchIdeaList(type, { author, category });
          return resolve(ideaList as GetList<IdeaDoc>);
        });
      });
    },
    { revalidateOnFocus: false }
  );
  const ideasRef = useRef(ideas);

  useEffect(() => {
    ideasRef.current = ideas;
  }, [ideas]);

  const isIdeaListLoading = !ideas && !error;

  return {
    ideas,
    ideasRef,
    isIdeaListLoading,
    setIdeas: mutate,
  };
};
