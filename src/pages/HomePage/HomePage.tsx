import { useEffect, useState, useCallback } from 'react';
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
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

import { useInfiniteScroll, usePopUp, useQuery, useStateRef } from 'hooks';
import { CreateIdeaDoc, DesignDoc, GetList, IdeaDoc, VoteDoc } from 'pouchDB/types';
import { usePouchDB } from 'context';

import { MenuTab } from './components/MenuTab';
import { Categories } from './components/Categories';
import { IdeaItem } from './components/IdeaItem';
import { IdeaCreateUpdateContainer } from './components/IdeaCreateUpdateContainer';
import styles from './homePage.module.scss';
import { onIdeaChange } from './homePage.helper';
import { Filter, TabType, TagCount } from './types';

const DOCS_ON_EACH_LOAD = 20;

export const HomePage = (): JSX.Element => {
  const { popUp, handlePopUpOpen, handlePopUpClose } = usePopUp(['newIdea'] as const);
  const [ideas, setIdeas, ideasRef] = useStateRef<GetList<IdeaDoc>>({
    hasNextPage: false,
    docs: [],
  });
  const [tagCount, setTagCount] = useState<TagCount>({ isLoading: true, data: [] });
  const { idea, tag, vote, db } = usePouchDB();
  const query = useQuery();
  const useInfo = window?.OpAuthHelper?.getUserInfo();

  const authorQuery = query.get('author');
  const categoryQuery = query.get('category') as string;
  const isPopularQuery = query.get('popular');
  const [tab, setTab] = useState<TabType>(
    isPopularQuery ? { tabIndex: 1, tabName: 'popular' } : { tabIndex: 0, tabName: 'recent' }
  );

  const { fetchState, handleFetchState } = useInfiniteScroll(() => {
    // setTimeout is applied to debounce the request for efficiency
    const fetchIdeaBounce = setTimeout(async () => {
      clearInterval(fetchIdeaBounce);
      if (ideas.hasNextPage && ideas.cb) {
        const { docs, hasNextPage, cb } = await ideas.cb();
        setIdeas((ideas) => ({ hasNextPage, cb, docs: [...ideas.docs, ...docs] }));
      }
      handleFetchState('isFetching', false);
    }, 1000);
  });

  const handleFetchIdeaList = useCallback(
    async (type: 'recent' | 'popular', filter: Filter) => {
      try {
        let ideaList: GetList<IdeaDoc> = { hasNextPage: true, docs: [] };
        if (type === 'popular') {
          ideaList = await idea.getIdeaListByPopular({ limit: DOCS_ON_EACH_LOAD, filter });
        } else {
          ideaList = await idea.getIdeaListByRecent({ limit: DOCS_ON_EACH_LOAD, filter });
        }
        setIdeas(ideaList);
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idea]
  );

  const handleFetchTags = useCallback(async () => {
    try {
      const { rows } = await tag.getTagCounts();
      rows.sort((a, b) => b.value - a.value).splice(10);
      setTagCount({ isLoading: false, data: rows });
    } catch (error) {
      setTagCount({ isLoading: false, data: [] });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.OpAuthHelper.onLogin(() => {
      handleFetchIdeaList(tab.tabName, { author: authorQuery, category: categoryQuery });
      handleFetchTags();
    });
  }, [tab.tabName, handleFetchIdeaList, authorQuery, categoryQuery, handleFetchTags]);

  /**
   * Couchdb changes feed
   * Why ref state -> To avoid registering back and forth event each time on state change
   * change event is getting reflected on ideaList state which causes re-registration each time
   * To avoid this and making it one time registration, I have used reference to avoid stale state
   */
  useEffect(() => {
    const dbChanges = db
      .changes<IdeaDoc | VoteDoc>({
        since: 'now',
        live: true,
        include_docs: true,
        filter: DesignDoc.HomePageFilter,
        query_params: {
          user: useInfo?.rhatUUID,
        },
      })
      .on('change', onIdeaChangeCB)
      .on('error', function (err) {
        console.error(err);
        window.OpNotification.warning({
          subject: 'Idea live change registration failed',
          body: err.message,
        });
      });
    return () => dbChanges.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onIdeaChangeCB = useCallback(
    async ({ doc }: PouchDB.Core.ChangesResponseChange<IdeaDoc | VoteDoc>) => {
      if (doc && doc?.type === 'idea') {
        await handleFetchTags();
        const newIdeaList = await onIdeaChange(doc, ideasRef.current.docs, idea);
        setIdeas((ideas) => ({ ...ideas, docs: newIdeaList }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ideas.docs]
  );

  const handleTabChange = useCallback((tabIndex: number) => {
    setTab(tabIndex === 1 ? { tabIndex, tabName: 'popular' } : { tabIndex, tabName: 'recent' });
  }, []);

  const handleCreateOrUpdateIdeaDoc = useCallback(
    async (data: CreateIdeaDoc, createdTags: string[], isUpdate: boolean) => {
      try {
        await tag.createNewTags(createdTags);
        if (isUpdate) {
          await idea.updateAnIdea(
            (
              popUp.newIdea.data as PouchDB.Core.ExistingDocument<
                IdeaDoc & PouchDB.Core.AllDocsMeta
              >
            )?._id,
            data
          );
        } else {
          await idea.createNewIdea(data);
        }
        handlePopUpClose('newIdea');
      } catch (error) {
        console.error(error);
        window.OpNotification.danger({
          subject: `Error on ${isUpdate ? 'creation' : 'updation'} of idea`,
          body: error.message,
        });
      }
    },
    [handlePopUpClose, popUp.newIdea.data, idea, tag]
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

  const handleArchiveButtonClick = useCallback(
    async (ideaId: string) => {
      try {
        const isArchived = await idea.toggleArchiveIdea(ideaId);
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
    },
    [idea]
  );

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
              <Categories tags={tagCount} />
            </FlexItem>
          </Flex>
        </GridItem>
        <GridItem span={9}>
          <Flex direction={{ default: 'column' }} flexWrap={{ default: 'nowrap' }}>
            <FlexItem className={styles['sticky-title']}>
              <MenuTab handleTabChange={handleTabChange} tab={tab} />
            </FlexItem>
            {ideas.docs.length === 0 && (
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
                {ideas.docs.map((idea) => {
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
                })}
                {fetchState.isFetching && (
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
