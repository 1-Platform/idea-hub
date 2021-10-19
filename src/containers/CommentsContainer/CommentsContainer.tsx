import { ReactNode, useRef, useCallback, useEffect, useState } from 'react';

import {
  Avatar,
  Bullseye,
  Dropdown,
  DropdownItem,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  Title,
  TitleSizes,
  Form,
  FormGroup,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  DropdownToggle,
  TextArea,
  ActionGroup,
  Button,
  Spinner,
} from '@patternfly/react-core';
import { SortAmountDownIcon, CubesIcon } from '@patternfly/react-icons';
import { Controller, useForm } from 'react-hook-form';
import { CommentBox } from './components/CommentBox';
import { useInfiniteScroll, useToggle } from 'hooks';
import { CommentDoc, DesignDoc, IdeaDoc } from 'pouchDB/types';
import { commentDoc as commentModel, remoteDb } from 'pouchDB';
import { onCommentChange } from './commentsContainer.helper';
import { useGetComments } from './hooks/useGetComments';

interface FormData {
  comment: string;
}

interface Props {
  children?: ReactNode;
  ideaDetails: PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>;
}

const COMMENTS_ON_EACH_LOAD = 20;

export const CommentsContainer = ({ ideaDetails }: Props): JSX.Element => {
  const { _id: ideaId, comments: commentCount, author } = ideaDetails;
  const { isOpen, handleToggle } = useToggle(false);
  const [sortOrder, setSortOrder] = useState<0 | 1>(0);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const { comments, commentsRef, isCommentsLoading, mutateComments } = useGetComments({
    ideaId,
    order: sortOrder,
    limit: COMMENTS_ON_EACH_LOAD,
  });

  const dbChangeFeed = useRef<PouchDB.Core.Changes<IdeaDoc | CommentDoc>>();

  const commentWatch = watch('comment');

  const { fetchState, handleFetchState } = useInfiniteScroll(() => {
    // setTimeout is applied to debounce the request for efficiency
    const fetchIdeaBounce = setTimeout(async () => {
      clearInterval(fetchIdeaBounce);
      if (comments?.hasNextPage && comments?.cb) {
        comments
          .cb()
          .then(({ docs, hasNextPage, cb }) => {
            mutateComments(
              (comments) => ({ hasNextPage, cb, docs: [...(comments?.docs || []), ...docs] }),
              false
            );
          })
          .finally(() => {
            handleFetchState('isFetching', false);
          });
      } else {
        handleFetchState('isFetching', false);
      }
    }, 1000);
  });

  useEffect(() => {
    window.OpAuthHelper.onLogin(() => {
      dbChangeFeed.current = remoteDb
        .changes<IdeaDoc | CommentDoc>({
          since: 'now',
          live: true,
          include_docs: true,
          filter: DesignDoc.IdeaDetailPageFilter,
          query_params: {
            ideaId,
          },
        })
        .on('change', handleCommentFeedChange)
        .on('error', function (err) {
          console.error(err);
          window.OpNotification.warn({
            subject: 'Idea live change registration failed',
            body: err.message,
          });
        });
    });
    window.addEventListener('beforeunload', dbChangeFeedCancel);
    return () => {
      window.removeEventListener('beforeunload', dbChangeFeedCancel);
      dbChangeFeedCancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dbChangeFeedCancel = () => {
    dbChangeFeed.current?.cancel();
  };

  const handleCommentFeedChange = async ({
    doc,
  }: PouchDB.Core.ChangesResponseChange<IdeaDoc | CommentDoc>) => {
    if (doc && doc?.type === 'comment' && commentsRef.current) {
      const newCommentList = await onCommentChange(doc, commentsRef.current.docs, commentModel);
      mutateComments(
        (comments) => ({
          cb: comments?.cb,
          hasNextPage: Boolean(comments?.hasNextPage),
          docs: newCommentList,
        }),
        false
      );
    }
  };

  const onFormSubmit = async ({ comment: commentFieldValue }: FormData) => {
    try {
      await commentModel.createComment(ideaId, commentFieldValue);
      setValue('comment', '');
      commentModel.updateTotalCommentCountOfAnIdea(ideaId);
    } catch (error) {
      console.error(error);
      window.OpNotification.danger({
        subject: 'Error on creating comment',
        body: error.message,
      });
    }
    return;
  };

  const handleLikeClick = useCallback(
    async (hasLiked: boolean, commentId: string) => {
      const commentsAfterVoting =
        comments?.docs.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                hasLiked: !hasLiked,
                votes: hasLiked ? comment.votes - 1 : comment.votes + 1,
              }
            : comment
        ) || [];
      try {
        hasLiked
          ? await commentModel.deleteLikeOfAComment(commentId)
          : await commentModel.likeAComment(commentId);
        mutateComments(
          (ideas) => ({
            cb: ideas?.cb,
            hasNextPage: Boolean(ideas?.hasNextPage),
            docs: commentsAfterVoting,
          }),
          false
        );
      } catch (error) {
        console.error(error);
        window.OpNotification.danger({
          subject: 'Like failed',
          body: error.message,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comments]
  );

  const handleMenuClick = useCallback((sortOrder: 0 | 1) => {
    setSortOrder(sortOrder);
  }, []);

  const dropdownItems = [
    <DropdownItem
      key="sort-new"
      component="button"
      className="pf-u-color-400"
      onClick={() => handleMenuClick(0)}
    >
      Newest First
    </DropdownItem>,
    <DropdownItem
      key="top-comments"
      component="button"
      className="pf-u-color-400"
      onClick={() => handleMenuClick(1)}
    >
      Top Comments
    </DropdownItem>,
  ];

  return (
    <Stack hasGutter className="pf-u-w-100">
      <StackItem>
        <Split hasGutter>
          <SplitItem className="pf-u-mr-lg">
            <Title headingLevel="h5" size={TitleSizes['lg']}>
              {commentCount ? `${commentCount} responses` : 'No responses yet'}
            </Title>
          </SplitItem>
          <SplitItem>
            <Bullseye>
              <Dropdown
                toggle={
                  <DropdownToggle
                    className="pf-u-p-0 pf-u-color-400"
                    onToggle={handleToggle}
                    toggleIndicator={SortAmountDownIcon}
                    isPlain
                  >
                    Sort by
                  </DropdownToggle>
                }
                isOpen={isOpen}
                onSelect={handleToggle}
                isPlain
                dropdownItems={dropdownItems}
                position="left"
              />
            </Bullseye>
          </SplitItem>
        </Split>
      </StackItem>
      <StackItem>
        <Split hasGutter>
          <SplitItem>
            <Avatar
              src="https://www.patternfly.org/v4/images/avatarImg.6daf7202106fbdb9c72360d30a6ea85d.svg"
              alt="user-avater"
              aria-label="user image"
            />
          </SplitItem>
          <SplitItem isFilled>
            <Form onSubmit={handleSubmit(onFormSubmit)}>
              <Controller
                name="comment"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <FormGroup
                    fieldId="comment"
                    helperTextInvalid={error?.message}
                    validated={error?.message ? 'error' : 'default'}
                  >
                    <TextArea
                      style={{ resize: 'none' }}
                      id="comment"
                      aria-label="new comment"
                      placeholder={`Share your thoughts about ${author}'s idea…`}
                      allowFullScreen
                      isRequired
                      validated={error?.message ? 'error' : 'default'}
                      {...field}
                    />
                  </FormGroup>
                )}
              />
              <ActionGroup className="pf-u-mt-0">
                <Button
                  variant="primary"
                  isSmall
                  className="pf-u-py-sm pf-u-px-lg"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  Submit
                </Button>
                {Boolean(commentWatch) && (
                  <Button variant="link" onClick={() => setValue('comment', '')}>
                    Clear
                  </Button>
                )}
              </ActionGroup>
            </Form>
          </SplitItem>
        </Split>
      </StackItem>
      {comments?.docs.length === 0 && (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No comments found
          </Title>
          <EmptyStateBody>Share your opinion on this idea.</EmptyStateBody>
        </EmptyState>
      )}
      {isCommentsLoading ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : (
        comments?.docs.map(({ content, author, createdAt, _id, hasLiked, votes }) => (
          <StackItem key={_id}>
            <CommentBox
              author={author}
              content={content}
              createdAt={createdAt}
              hasLiked={hasLiked}
              votes={votes}
              onLike={() => handleLikeClick(hasLiked, _id)}
            />
          </StackItem>
        ))
      )}
      {comments?.docs.length !== 0 && fetchState.isFetching && (
        <StackItem>
          <Text className="pf-u-text-align-center">Loading more comments...</Text>
        </StackItem>
      )}
    </Stack>
  );
};
