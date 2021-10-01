import { useCallback } from 'react';
import { Text } from '@patternfly/react-core';
import { CommentField } from 'components';
import { useToggle } from 'hooks';

type Props = {
  author: string;
  createdAt: number;
  content: string;
  onLike: () => Promise<void>;
  hasLiked: boolean;
  votes: number;
};

export const CommentBox = ({
  author,
  createdAt,
  content,
  onLike,
  hasLiked,
  votes,
}: Props): JSX.Element => {
  const { isOpen: isLiking, handleToggle } = useToggle(false);
  const formatCommentLikeButton = useCallback(
    (hasLiked: boolean, likes: number, isLiking: boolean): string => {
      if (isLiking) return hasLiked ? 'Disliking' : 'Liking';
      const likedOrNotLikedString = hasLiked ? 'Unlike' : 'Like';
      return likedOrNotLikedString + (Boolean(likes) ? `(+${likes})` : '');
    },
    []
  );

  const onLikeButtonClick = async (): Promise<void> => {
    handleToggle();
    await onLike();
    handleToggle();
  };

  return (
    <CommentField commenterName={author} createdAt={createdAt}>
      <Text aria-label="comment-content">{content}</Text>
      <CommentField.CommentButton onClick={onLikeButtonClick} isDisabled={isLiking}>
        {formatCommentLikeButton(hasLiked, votes, isLiking)}
      </CommentField.CommentButton>
    </CommentField>
  );
};
