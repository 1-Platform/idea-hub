import { useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Chip,
  ChipGroup,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Text,
  TextVariants,
  Title,
  TitleSizes,
  Alert,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import { CubesIcon, LongArrowAltLeftIcon, ShareIcon } from '@patternfly/react-icons';

import { VoteCard } from 'components';
import { CommentsContainer } from 'containers/CommentsContainer';
import { postedOnFormater } from 'utils/postedOnFormater';
import { CommentDoc, DesignDoc, IdeaDoc } from 'pouchDB/types';
import { ideaDoc, voteDoc, remoteDb } from 'pouchDB';
import { onIdeaChange } from './ideaDetailPage.helper';
import { useGetAnIdea } from './hooks/useGetAnIdea';

export const IdeaDetailPage = (): JSX.Element => {
  const { id } = useParams();

  const { idea, isIdeaLoading, mutateIdea } = useGetAnIdea({ id });

  const dbChangeFeed = useRef<PouchDB.Core.Changes<IdeaDoc | CommentDoc>>();

  useEffect(() => {
    window.OpAuthHelper.onLogin(() => {
      dbChangeFeed.current = remoteDb
        .changes<IdeaDoc | CommentDoc>({
          since: 'now',
          live: true,
          include_docs: true,
          filter: DesignDoc.IdeaDetailPageFilter,
          query_params: {
            ideaId: id,
          },
        })
        .on('change', async function ({ doc }) {
          // change.id contains the doc id, change.doc contains the doc
          if (doc && doc.type === 'idea') {
            const updatedIdeaDetails = await onIdeaChange(doc, ideaDoc);
            mutateIdea(updatedIdeaDetails, false);
          }
        })
        .on('error', function (err) {
          console.error(err);
          window.OpNotification.warning({
            subject: 'Comment live change registration failed',
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
  }, [id]);

  const dbChangeFeedCancel = () => {
    dbChangeFeed.current?.cancel();
  };

  const postedOn = useMemo(() => postedOnFormater(idea?.createdAt || ''), [idea?.createdAt]);

  const handleVoteClick = useCallback(
    async (hasVoted: boolean, ideaId: string) => {
      if (!idea) return; // undefined guard
      const totalVotes = hasVoted ? idea?.votes - 1 : idea?.votes + 1;
      const ideaAfterVoting = { ...idea, hasVoted: !hasVoted, votes: totalVotes };
      try {
        hasVoted ? await voteDoc.deleteVote(ideaId) : await voteDoc.createVote(ideaId);
        mutateIdea(ideaAfterVoting);
      } catch (error) {
        console.error(error);
        window.OpNotification.danger({
          subject: 'Voting failed',
          body: error.message,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idea]
  );

  if (isIdeaLoading) {
    return (
      <Bullseye className="pf-u-p-xl">
        <Spinner />
      </Bullseye>
    );
  }

  if (!idea) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          No idea found
        </Title>
        <EmptyStateBody>Please check the blog id</EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <Grid hasGutter style={{ gap: '60px' }}>
      <GridItem span={9}>
        <Flex direction={{ default: 'column' }} flexWrap={{ default: 'nowrap' }}>
          <Flex spaceItems={{ default: 'spaceItems2xl' }}>
            <FlexItem>
              <Link to="..">
                <Button
                  variant="link"
                  icon={<LongArrowAltLeftIcon />}
                  className="pf-u-p-0 pf-u-font-size-xs"
                >
                  Back
                </Button>
              </Link>
            </FlexItem>
            <FlexItem>
              <Breadcrumb className="pf-u-color-400">
                <BreadcrumbItem>Ideas</BreadcrumbItem>
                <BreadcrumbItem>{idea?.ideaId}</BreadcrumbItem>
              </Breadcrumb>
            </FlexItem>
            <FlexItem>
              <Text
                component={TextVariants['small']}
                className="pf-u-color-400"
              >{`Posted on ${postedOn}`}</Text>
            </FlexItem>
          </Flex>
          <FlexItem>
            {idea.isArchived && (
              <Alert
                variant="warning"
                title="This idea has been archived and is read-only."
                isInline
              />
            )}
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              {idea.title}
            </Title>
          </FlexItem>
          <FlexItem spacer={{ default: 'spacerXl' }}>
            <Text>{idea.description}</Text>
          </FlexItem>
          <Flex grow={{ default: 'grow' }} className="pf-u-mb-4xl">
            <CommentsContainer
              ideaDetails={
                idea as PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>
              }
            />
          </Flex>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            <VoteCard
              voteCount={idea.votes}
              authorName={idea.author}
              hasVoted={idea.hasVoted}
              onVoteClick={() => handleVoteClick(idea.hasVoted, idea._id)}
            >
              <VoteCard.Button variant="link" icon={<ShareIcon />} style={{ color: 'unset' }}>
                Share
              </VoteCard.Button>
            </VoteCard>
          </FlexItem>
          <FlexItem>
            <div className="pf-u-mb-md">
              <Title headingLevel="h6">Related tags:</Title>
            </div>
            <ChipGroup>
              {idea.tags.map((category) => (
                <Link to={`..?category=${category}`} key={category}>
                  <Chip isReadOnly className="capitalize">
                    {category}
                  </Chip>
                </Link>
              ))}
            </ChipGroup>
          </FlexItem>
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>
              <Title headingLevel="h6">Other links:</Title>
            </FlexItem>
            <FlexItem>
              <Link to={`..?author=${idea.authorId}`}>
                <Button variant="plain" className="pf-u-p-0">
                  {`More ideas from ${idea.author}`}
                </Button>
              </Link>
            </FlexItem>
            <FlexItem>
              <Link to="..?popular=true">
                <Button variant="plain" className="pf-u-p-0">
                  More popular ideas
                </Button>
              </Link>
            </FlexItem>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  );
};
