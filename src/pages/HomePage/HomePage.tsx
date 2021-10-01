import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Text,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

import { useInfiniteScroll, usePopUp, useQuery } from 'hooks';
import { CreateIdeaDoc, DesignDoc, GetList, IdeaDoc, TagDoc, VoteDoc } from 'pouchDB/types';
import { ideaDoc, tagDoc, voteDoc, remoteDb } from 'pouchDB';

import { MenuTab } from './components/MenuTab';
import { Categories } from './components/Categories';
import { IdeaItem } from './components/IdeaItem';
import { IdeaCreateUpdateContainer } from './components/IdeaCreateUpdateContainer';
import { useGetIdeaList } from './hooks/useGetIdeaList';
import { useGetTagCountList } from './hooks/useGetTagCountList';
import { onIdeaChange } from './homePage.helper';
import { TabType } from './types';
import styles from './homePage.module.scss';

const DOCS_ON_EACH_LOAD = 20;

export const HomePage = (): JSX.Element => {
  const { popUp, handlePopUpOpen, handlePopUpClose } = usePopUp(['newIdea'] as const);
  const query = useQuery();
  const authorQuery = query.get('author') as string;
  const categoryQuery = query.get('category') as string;
  const isPopularQuery = query.get('popular');
  const [tab, setTab] = useState<TabType>(
    isPopularQuery ? { tabIndex: 1, tabName: 'popular' } : { tabIndex: 0, tabName: 'recent' }
  );
  const dbChangeFeed = useRef<PouchDB.Core.Changes<IdeaDoc | VoteDoc>>();

  const { ideas, isIdeaListLoading, setIdeas, ideasRef } = useGetIdeaList({
    type: tab.tabName,
    author: authorQuery,
    category: categoryQuery,
    limit: DOCS_ON_EACH_LOAD,
  });

  const { tagCount, isTagsLoading, mutateTags } = useGetTagCountList();

  const { fetchState, handleFetchState } = useInfiniteScroll(() => {
    // setTimeout is applied to debounce the request for efficiency
    const fetchIdeaBounce = setTimeout(async () => {
      clearInterval(fetchIdeaBounce);
      if (ideas?.hasNextPage && ideas?.cb) {
        ideas
          .cb()
          .then(({ docs, hasNextPage, cb }) => {
            setIdeas(
              (ideas) => ({ hasNextPage, cb, docs: [...(ideas?.docs || []), ...docs] }),
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

  /**
   * Couchdb changes feed
   * Why ref state -> To avoid registering back and forth event each time on state change
   * change event is getting reflected on ideaList state which causes re-registration each time
   * To avoid this and making it one time registration, I have used reference to avoid stale state
   */
  useEffect(() => {
    window.OpAuthHelper.onLogin(() => {
      dbChangeFeed.current = remoteDb
        .changes<IdeaDoc | VoteDoc>({
          since: 'now',
          live: true,
          include_docs: true,
          filter: DesignDoc.HomePageFilter,
        })
        .on('change', onIdeaChangeCB)
        .on('error', function (err) {
          console.error(err);
          window.OpNotification.warning({
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

  const onIdeaChangeCB = async ({ doc }: PouchDB.Core.ChangesResponseChange<IdeaDoc | VoteDoc>) => {
    if (doc && doc?.type === 'idea' && ideasRef.current) {
      mutateTags();
      const newIdeaList = await onIdeaChange(doc, ideasRef.current.docs, ideaDoc);
      setIdeas(
        (ideas) => ({
          cb: ideas?.cb,
          hasNextPage: Boolean(ideas?.hasNextPage),
          docs: newIdeaList,
        }),
        false
      );
    }
  };

  const handleTabChange = useCallback((tabIndex: number) => {
    setTab(tabIndex === 1 ? { tabIndex, tabName: 'popular' } : { tabIndex, tabName: 'recent' });
  }, []);

  const handleCreateOrUpdateIdeaDoc = useCallback(
    async (data: CreateIdeaDoc, createdTags: string[], isUpdate: boolean) => {
      try {
        await tagDoc.createNewTags(createdTags);
        if (isUpdate) {
          await ideaDoc.updateAnIdea(
            (
              popUp.newIdea.data as PouchDB.Core.ExistingDocument<
                IdeaDoc & PouchDB.Core.AllDocsMeta
              >
            )?._id,
            data
          );
        } else {
          await ideaDoc.createNewIdea(data);
        }
        handlePopUpClose('newIdea');
      } catch (error) {
        console.error(error);
        window.OpNotification.danger({
          subject: `Error on ${isUpdate ? 'updating' : 'creating'} of idea`,
          body: error.message,
        });
      }
    },
    [handlePopUpClose, popUp.newIdea.data]
  );

  const handleVoteClick = useCallback(
    async (hasVoted: boolean, ideaId: string) => {
      const ideasAfterVoting =
        ideas?.docs.map((idea) =>
          idea._id === ideaId
            ? { ...idea, hasVoted: !hasVoted, votes: hasVoted ? idea.votes - 1 : idea.votes + 1 }
            : idea
        ) || [];
      try {
        hasVoted ? await voteDoc.deleteVote(ideaId) : await voteDoc.createVote(ideaId);
        setIdeas(
          (ideas) => ({
            cb: ideas?.cb,
            hasNextPage: Boolean(ideas?.hasNextPage),
            docs: ideasAfterVoting,
          }),
          false
        );
      } catch (error) {
        console.error(error);
        window.OpNotification.danger({
          subject: 'Voting failed',
          body: error.message,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ideas?.docs]
  );

  const handleArchiveButtonClick = useCallback(async (ideaId: string) => {
    try {
      const isArchived = await ideaDoc.toggleArchiveIdea(ideaId);
      window.OpNotification.success({
        subject: `Successfully ${isArchived ? 'archived' : 'unarchived'}`,
      });
    } catch (error) {
      console.error(error);
      window.OpNotification.danger({
        subject: 'Archiving failed',
        body: error.message,
      });
    }
  }, []);

  return (
    <>
      <Grid hasGutter>
        <GridItem span={3}>
          <Flex
            direction={{ default: 'column' }}
            flexWrap={{ default: 'nowrap' }}
            className={styles['sticky-title']}
          >
            <FlexItem>
              <Button variant="primary" isBlock onClick={() => handlePopUpOpen('newIdea')}>
                Post a new idea!
              </Button>
            </FlexItem>
            <FlexItem>
              <Categories
                tags={tagCount as PouchDB.Query.Response<TagDoc>['rows']}
                isLoading={isTagsLoading}
              />
            </FlexItem>
          </Flex>
        </GridItem>
        <GridItem span={9}>
          <Flex direction={{ default: 'column' }} flexWrap={{ default: 'nowrap' }}>
            <FlexItem className={styles['sticky-title']}>
              <MenuTab handleTabChange={handleTabChange} tab={tab} />
            </FlexItem>
            {ideas?.docs.length === 0 && (
              <EmptyState>
                <EmptyStateIcon icon={CubesIcon} />
                <Title headingLevel="h4" size="lg">
                  No ideas found
                </Title>
                <EmptyStateBody>
                  You have an idea - Let&apos;s share it with everyone
                </EmptyStateBody>
              </EmptyState>
            )}
            <FlexItem>
              <Stack hasGutter>
                {isIdeaListLoading ? (
                  <Bullseye className="pf-u-p-xl">
                    <Spinner />
                  </Bullseye>
                ) : (
                  (ideas as GetList<IdeaDoc>).docs.map((idea) => {
                    const {
                      _id,
                      title,
                      author,
                      votes,
                      comments,
                      createdAt,
                      hasVoted,
                      isArchived,
                      ideaId,
                    } = idea;
                    return (
                      <StackItem key={_id} className="pf-u-mx-xs">
                        <Link to={`${ideaId}`}>
                          <IdeaItem
                            voteCount={votes}
                            commentCount={comments}
                            postedOn={createdAt}
                            user={author}
                            hasVoted={hasVoted}
                            title={title}
                            isArchived={isArchived}
                            onVoteClick={async () => handleVoteClick(hasVoted, _id)}
                            onArchiveButtonClick={async () => handleArchiveButtonClick(_id)}
                            onEditIdeaClick={() => handlePopUpOpen('newIdea', idea)}
                          />
                        </Link>
                      </StackItem>
                    );
                  })
                )}
                {ideas?.docs.length !== 0 && fetchState.isFetching && (
                  <StackItem>
                    <Text className="pf-u-text-align-center">Loading more ideas...</Text>
                  </StackItem>
                )}
              </Stack>
            </FlexItem>
          </Flex>
        </GridItem>
      </Grid>
      <Modal
        title="Post a new Idea!"
        isOpen={popUp.newIdea.isOpen}
        variant={ModalVariant.small}
        onClose={() => handlePopUpClose('newIdea')}
      >
        <IdeaCreateUpdateContainer
          handleModalClose={() => handlePopUpClose('newIdea')}
          handleCreateOrUpdateIdeaDoc={handleCreateOrUpdateIdeaDoc}
          updateDefaultValue={popUp.newIdea.data as IdeaDoc}
        />
      </Modal>
    </>
  );
};
