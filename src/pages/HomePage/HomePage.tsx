import { Button, Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';

import { MenuTab } from './components/MenuTab';
import { Categories } from './components/Categories';
import { IdeaItem } from './components/IdeaItem';

export const HomePage = (): JSX.Element => {
    return (
        <Grid hasGutter>
            <GridItem span={3}>
                <Button variant="primary" isBlock>
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
                    {Array(10)
                        .fill(0)
                        .map((_, index) => (
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
                </Stack>
            </GridItem>
        </Grid>
    );
};
