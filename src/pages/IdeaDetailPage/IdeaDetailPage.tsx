import { Flex, FlexItem, Grid, GridItem, Text } from '@patternfly/react-core';
import { ShareIcon } from '@patternfly/react-icons';

import { CommentField, VoteCard } from 'components';

export const IdeaDetailPage = (): JSX.Element => {
  return (
    <Grid hasGutter>
      <GridItem span={9}>
        <Flex direction={{ default: 'column' }} flexWrap={{ default: 'nowrap' }}>
          <FlexItem>
            <CommentField commenterName="Rigin Oomen" createdAt="6/12/2021">
              <Text>I like this idea a lot! Definitely worth exploring.</Text>

              <CommentField.CommentButton>Like</CommentField.CommentButton>
              <CommentField.CommentButton>Reply</CommentField.CommentButton>
            </CommentField>
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <VoteCard voteCount={100} voter="Mayur Deshmukh">
          <VoteCard.Button variant="link" icon={<ShareIcon />} style={{ color: 'unset' }}>
            Share
          </VoteCard.Button>
        </VoteCard>
      </GridItem>
    </Grid>
  );
};
