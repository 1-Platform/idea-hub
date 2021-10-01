import { commentDoc } from 'pouchDB';
import { CommentDoc, GetList } from 'pouchDB/types';
import { useEffect, useRef } from 'react';
import useSWR, { KeyedMutator } from 'swr';

type Props = {
  ideaId: string;
  order: 0 | 1;
  limit: number;
};

type UseGetIdeaListReturn = {
  comments?: GetList<CommentDoc>;
  commentsRef: React.MutableRefObject<GetList<CommentDoc> | undefined>;
  isCommentsLoading: boolean;
  mutateComments: KeyedMutator<GetList<CommentDoc>>;
};

const handleFetchComments = async (ideaId: string, sortOrder: 0 | 1, limit: number) => {
  try {
    let commentsFetched: GetList<CommentDoc> = { hasNextPage: true, docs: [] };
    if (sortOrder === 0) {
      commentsFetched = await commentDoc.getCommentListByRecent({
        ideaId,
        limit,
      });
    } else if (sortOrder === 1) {
      commentsFetched = await commentDoc.getCommentListByPopular({
        ideaId,
        limit,
      });
    }
    return commentsFetched;
  } catch (error) {
    console.error(error);
    window.OpNotification.danger({
      subject: 'Error while loading comments',
      body: error.message,
    });
  }
};

export const useGetComments = ({ ideaId, order, limit }: Props): UseGetIdeaListReturn => {
  const {
    data: comments,
    mutate,
    error,
  } = useSWR(
    [`/idea/${ideaId}/?order=${order}&limit=${limit}`, ideaId, order, limit],
    async (_url, ideaId, order, limit): Promise<GetList<CommentDoc>> => {
      return new Promise((resolve) => {
        window.OpAuthHelper.onLogin(async () => {
          const commentList = await handleFetchComments(ideaId, order, limit);
          return resolve(commentList as GetList<CommentDoc>);
        });
      });
    },
    { revalidateOnFocus: false }
  );
  const commentsRef = useRef(comments);

  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  const isCommentsLoading = !comments && !error;

  return {
    comments,
    commentsRef,
    isCommentsLoading,
    mutateComments: mutate,
  };
};
