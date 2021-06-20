import { useState } from 'react';
import { Button, Grid, GridItem, Stack, StackItem, Text } from '@patternfly/react-core';

import { useInfiniteScroll, usePopUp } from 'hooks';

import { MenuTab } from './components/MenuTab';
import { Categories } from './components/Categories';
import { IdeaItem } from './components/IdeaItem';
import { NewIdeaModal } from './components/NewIdeaModal';

const MAXIMUM_POSTS = 50;
const EACH_LOADING = 10;

export const HomePage = (): JSX.Element => {
  const { popUp, handlePopUpOpen, handlePopUpClose } = usePopUp(['newIdea'] as const);
  const [ideas, setIdeas] = useState<number[]>(Array(10).fill(0));

  const [isFetching, setIsFetching] = useInfiniteScroll(() => {
    // setTimeout is applied to debounce the request for efficiency
    const fetchIdeaBounce = setTimeout(() => {
      clearInterval(fetchIdeaBounce);
      if (ideas.length < MAXIMUM_POSTS) {
        setIdeas((ideas) => [...ideas, ...Array(EACH_LOADING).fill(0)]);
      }
      setIsFetching(false);
    }, 1000);
  });

  return (
    <>
      <Grid hasGutter>
        <GridItem span={3}>
          <Button variant="primary" isBlock onClick={() => handlePopUpOpen('newIdea')}>
            Post a new idea!
          </Button>
        </GridItem>
        <GridItem span={9}>
          <MenuTab />
        </GridItem>
        <GridItem span={3}>
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
            {isFetching && (
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
