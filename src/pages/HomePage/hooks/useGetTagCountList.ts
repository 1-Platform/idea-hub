import { tagDoc } from 'pouchDB';
import { TagDoc } from 'pouchDB/types';
import useSWR, { KeyedMutator } from 'swr';

type UseGetTagCountListReturn = {
  tagCount?: PouchDB.Query.Response<TagDoc>['rows'];
  isTagsLoading: boolean;
  mutateTags: KeyedMutator<PouchDB.Query.Response<TagDoc>['rows']>;
};

const handleFetchTags = async (): Promise<PouchDB.Query.Response<TagDoc>['rows']> => {
  try {
    const { rows } = await tagDoc.getTagCounts();
    rows.sort((a, b) => b.value - a.value).splice(10);
    return rows;
  } catch (error) {
    window.OpNotification.danger({
      subject: 'Failed to fetch tags',
      body: error.message,
    });
  }
  return [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
};

export const useGetTagCountList = (): UseGetTagCountListReturn => {
  const {
    data: tagCount,
    error,
    mutate: mutateTags,
  } = useSWR('/tag-counts', async (): Promise<PouchDB.Query.Response<TagDoc>['rows']> => {
    return new Promise((resolve) => {
      window.OpAuthHelper.onLogin(async () => {
        return resolve(handleFetchTags());
      });
    });
  });

  const isTagsLoading = !error && !tagCount;

  return {
    tagCount,
    isTagsLoading,
    mutateTags,
  };
};
