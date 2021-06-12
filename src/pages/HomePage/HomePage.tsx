import { Button, Grid, GridItem } from '@patternfly/react-core';

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
                <IdeaItem />
            </GridItem>
        </Grid>
    );
};
