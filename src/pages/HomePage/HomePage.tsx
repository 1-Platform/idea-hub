import { useState } from 'react';
import { Button, Grid, GridItem, Stack, StackItem, Text } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { useInfiniteScroll, usePopUp } from 'hooks';

import { MenuTab } from './components/MenuTab';
import { Categories } from './components/Categories';
import { IdeaItem } from './components/IdeaItem';
import { NewIdeaModal } from './components/NewIdeaModal';

import styles from './homePage.module.scss';

const MAXIMUM_POSTS = 50;
const EACH_LOADING = 10;

export const HomePage = (): JSX.Element => {
  const { popUp, handlePopUpOpen, handlePopUpClose } = usePopUp(['newIdea'] as const);
  const [ideas, setIdeas] = useState<number[]>(Array(10).fill(0));

  const { fetchState, handleFetchState } = useInfiniteScroll(
    () => {
      // setTimeout is applied to debounce the request for efficiency
      const fetchIdeaBounce = setTimeout(() => {
        clearInterval(fetchIdeaBounce);
        if (ideas.length < MAXIMUM_POSTS) {
          setIdeas((ideas) => [...ideas, ...Array(EACH_LOADING).fill(0)]);
        } else {
          handleFetchState('isFetchDisabled', true);
        }
        handleFetchState('isFetching', false);
      }, 1000);
      /**
       * applied document.querySelected as infinite scrolling applied to layout outside here
       * or this can be called from layout and passed state as props
       */
    },
    () => document.querySelector('#app-layout-page') as HTMLElement
  );

  return (
    <>
      <Grid hasGutter id="innovation">
        <GridItem span={3} className={styles['sticky-title']}>
          <Button variant="primary" isBlock onClick={() => handlePopUpOpen('newIdea')}>
            Post a new idea!
          </Button>
        </GridItem>
        <GridItem span={9} className={css(styles['sticky-title'], styles['sticky-topbar'])}>
          <MenuTab />
        </GridItem>
        <GridItem span={3} className={styles['sticky-sidebar']}>
          <Categories />
        </GridItem>
        <GridItem span={9}>
          <Stack hasGutter>
            {ideas.map((_, index) => (
              <StackItem key={`idea-${index}`}>
                <IdeaItem
                  voteCount={100}
                  commentCount={2}
                  hasVoted={!index}
                  postedOn="6/12/2021"
                  user="Mayur Deshmukh"
                  title="An internal platform for associate run projects and experimentation"
                />
              </StackItem>
            ))}
            {fetchState.isFetching && (
              <StackItem>
                <Text className="pf-u-text-align-center">Loading more ideas...</Text>
              </StackItem>
            )}
          </Stack>
        </GridItem>
      </Grid>
      <NewIdeaModal
        isOpen={popUp.newIdea.isOpen}
        handleModalClose={() => handlePopUpClose('newIdea')}
      />
    </>
  );
};
