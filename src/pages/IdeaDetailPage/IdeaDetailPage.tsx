import { useMemo, useState, useEffect, useCallback } from 'react';
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
} from '@patternfly/react-core';
import { CubesIcon, LongArrowAltLeftIcon, ShareIcon } from '@patternfly/react-icons';

import { VoteCard } from 'components';
import { CommentsContainer } from 'containers/CommentsContainer';
import { postedOnFormater } from 'utils/postedOnFormater';
import { usePouchDB } from 'context';
import { CommentDoc, DesignDoc, IdeaDoc } from 'pouchDB/types';
import { onIdeaChange } from './ideaDetailPage.helper';

export const IdeaDetailPage = (): JSX.Element => {
  const { idea, vote, db } = usePouchDB();
  const [ideaDetails, setIdeaDetails] = useState<
    PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta> | null | Record<string, never>
  >(null);

  const { id } = useParams();

  useEffect(() => {
    const dbChanges = db
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
        if (doc && doc?.type === 'idea') {
          const updatedIdeaDetails = await onIdeaChange(doc, idea);
          setIdeaDetails(updatedIdeaDetails);
        }
      })
      .on('error', function (err) {
        console.error(err);
        window.OpNotification.warning({
          subject: 'Comment live change registration failed',
          body: err.message,
        });
      });
    return () => dbChanges.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleIdeaDetailsFetch = useCallback(async () => {
    try {
      const ideaDetailsFetched = await idea.getAnIdeaById(id);
      setIdeaDetails(ideaDetailsFetched ? ideaDetailsFetched : {});
    } catch (error) {
      console.error(error);
      window.OpNotification.danger({
        subject: 'Error while loading ideas',
        body: error.message,
      });
    }
  }, [id, idea]);

  useEffect(() => {
    window.OpAuthHelper.onLogin(() => handleIdeaDetailsFetch());
  }, [handleIdeaDetailsFetch]);

  const postedOn = useMemo(
    () => postedOnFormater(ideaDetails?.createdAt || ''),
    [ideaDetails?.createdAt]
  );

  const handleVoteClick = useCallback(
    async (hasVoted: boolean, ideaId: string) => {
      try {
        hasVoted ? await vote.deleteVote(ideaId) : await vote.createVote(ideaId);
      } catch (error) {
        console.error(error);
        window.OpNotification.danger({
          subject: 'Voting failed',
          body: error.message,
        });
      }
    },
    [vote]
  );

  if (!ideaDetails) {
    return <div>Loading...</div>;
  }

  if (Object.keys(ideaDetails).length === 0 && ideaDetails.constructor === Object) {
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
                <BreadcrumbItem>{ideaDetails?.ideaId}</BreadcrumbItem>
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
            {ideaDetails.isArchived && (
              <Alert
                variant="warning"
                title="This idea has been archived and is read-only."
                isInline
              />
            )}
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              {ideaDetails.title}
            </Title>
          </FlexItem>
          <FlexItem spacer={{ default: 'spacerXl' }}>
            <Text>{ideaDetails.description}</Text>
          </FlexItem>
          <Flex grow={{ default: 'grow' }} className="pf-u-mb-4xl">
            <CommentsContainer
              ideaDetails={
                ideaDetails as PouchDB.Core.ExistingDocument<IdeaDoc & PouchDB.Core.AllDocsMeta>
              }
            />
          </Flex>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            <VoteCard
              voteCount={ideaDetails.votes}
              authorName={ideaDetails.author}
              hasVoted={ideaDetails.hasVoted}
              onVoteClick={() => handleVoteClick(ideaDetails.hasVoted, ideaDetails._id)}
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
              {ideaDetails.tags.map((category) => (
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
              <Link to={`..?author=${ideaDetails.authorId}`}>
                <Button variant="plain" className="pf-u-p-0">
                  {`More ideas from ${ideaDetails.author}`}
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
