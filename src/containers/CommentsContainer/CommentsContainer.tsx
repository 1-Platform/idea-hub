import { ReactNode, useRef, useCallback, useEffect, useState } from 'react';

import {
  Avatar,
  Button,
  Bullseye,
  Dropdown,
  DropdownItem,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextInput,
  Title,
  TitleSizes,
  Form,
  FormGroup,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import { SortAmountDownIcon, CubesIcon } from '@patternfly/react-icons';
import { Controller, useForm } from 'react-hook-form';

import { CommentField } from 'components';
import { useInfiniteScroll, useToggle } from 'hooks';
import { usePouchDB } from 'context';
import { CommentDoc, DesignDoc, GetList, IdeaDoc } from 'pouchDB/types';
import { onCommentChange } from './commentsContainer.helper';

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
  const { control, handleSubmit, reset } = useForm<FormData>();
  const [commentDoc, setCommentDoc] = useState<GetList<CommentDoc>>({
    hasNextPage: false,
    docs: [],
  });
  const commentArea = useRef<HTMLInputElement | null>(null);
  const { comment, db } = usePouchDB();

  const { fetchState, handleFetchState } = useInfiniteScroll(() => {
    // setTimeout is applied to debounce the request for efficiency
    const fetchIdeaBounce = setTimeout(async () => {
      clearInterval(fetchIdeaBounce);
      if (commentDoc.hasNextPage && commentDoc.cb) {
        const { docs, hasNextPage, cb } = await commentDoc.cb();
        setCommentDoc((comments) => ({ hasNextPage, cb, docs: [...comments.docs, ...docs] }));
      }
      handleFetchState('isFetching', false);
    }, 1000);
  });

  useEffect(() => {
    const dbChanges = db
      .changes<IdeaDoc | CommentDoc>({
        since: 'now',
        live: true,
        include_docs: true,
        filter: DesignDoc.IdeaDetailPageFilter,
        query_params: {
          ideaId,
        },
      })
      .on('change', async function ({ doc }) {
        // change.id contains the doc id, change.doc contains the doc
        if (doc && doc?.type === 'comment') {
          const newCommentList = await onCommentChange(doc, commentDoc.docs, comment);
          setCommentDoc((comments) => ({ ...comments, docs: newCommentList }));
        }
      })
      .on('error', function (err) {
        console.error(err);
        window.OpNotification.warning({
          subject: 'Idea live change registration failed',
          body: err.message,
        });
      });
    return () => dbChanges.cancel();
  }, [comment, commentDoc.docs, ideaId, db]);

  useEffect(() => {
    window.OpAuthHelper.onLogin(() => handleFetchComments(sortOrder));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  const handleFetchComments = useCallback(
    async (sortOrder: 0 | 1) => {
      try {
        let commentsFetched: GetList<CommentDoc> = { hasNextPage: true, docs: [] };
        if (sortOrder === 0) {
          commentsFetched = await comment.getCommentListByRecent({
            ideaId,
            limit: COMMENTS_ON_EACH_LOAD,
          });
        } else if (sortOrder === 1) {
          commentsFetched = await comment.getCommentListByPopular({
            ideaId,
            limit: COMMENTS_ON_EACH_LOAD,
          });
        }
        setCommentDoc(commentsFetched);
      } catch (error) {
        console.error(error);
        window.OpNotification.danger({
          subject: 'Error while loading comments',
          body: error.message,
        });
      }
    },
    [comment, ideaId]
  );

  const onFormSubmit = async ({ comment: commentFieldValue }: FormData) => {
    try {
      await comment.createComment(ideaId, commentFieldValue);
      reset();
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
      try {
        hasLiked
          ? await comment.deleteLikeOfAComment(commentId)
          : await comment.likeAComment(commentId);
      } catch (error) {
        console.error(error);
        window.OpNotification.danger({
          subject: 'Like failed',
          body: error.message,
        });
      }
    },
    [comment]
  );

  const handleReplyButtonClick = useCallback((replyTo: string) => {
    if (commentArea.current) {
      commentArea.current.value = `@${replyTo} `;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      commentArea.current?.focus();
    }
  }, []);

  const handleMenuClick = useCallback((sortOrder: 0 | 1) => {
    setSortOrder(sortOrder);
  }, []);

  const formatCommentLikeButton = useCallback((hasLiked: boolean, likes: number): string => {
    const likedOrNotLikedString = hasLiked ? 'Unlike' : 'Like';
    return likedOrNotLikedString + (Boolean(likes) ? `(+${likes})` : '');
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
                  <Button
                    variant="link"
                    className="pf-u-p-0 pf-u-color-400"
                    onClick={handleToggle}
                    icon={<SortAmountDownIcon />}
                    iconPosition="right"
                  >
                    Sort by
                  </Button>
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
              <FormGroup fieldId="comment">
                <Controller
                  name="comment"
                  control={control}
                  defaultValue=""
                  render={({ field: { ref, ...field } }) => (
                    <TextInput
                      id="comment"
                      aria-label="new comment"
                      placeholder={`Share your thoughts about ${author}'s idea…`}
                      allowFullScreen
                      isRequired
                      ref={(e) => {
                        ref(e);
                        commentArea.current = e;
                      }}
                      {...field}
                    />
                  )}
                />
              </FormGroup>
            </Form>
          </SplitItem>
        </Split>
      </StackItem>
      {commentDoc.docs.length === 0 && (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No comments found
          </Title>
          <EmptyStateBody>Share your opinion on this idea.</EmptyStateBody>
        </EmptyState>
      )}
      {commentDoc.docs.map(({ content, author, authorId, createdAt, _id, hasLiked, votes }) => (
        <StackItem key={_id}>
          <CommentField commenterName={author} createdAt={createdAt}>
            <Text aria-label="comment-content">{content}</Text>
            <CommentField.CommentButton onClick={() => handleLikeClick(hasLiked, _id)}>
              {formatCommentLikeButton(hasLiked, votes)}
            </CommentField.CommentButton>
            <CommentField.CommentButton onClick={() => handleReplyButtonClick(authorId)}>
              Reply
            </CommentField.CommentButton>
          </CommentField>
        </StackItem>
      ))}
      {fetchState.isFetching && (
        <StackItem>
          <Text className="pf-u-text-align-center">Loading more comments...</Text>
        </StackItem>
      )}
    </Stack>
  );
};
