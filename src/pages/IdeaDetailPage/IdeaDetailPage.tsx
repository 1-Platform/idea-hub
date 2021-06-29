import { CSSProperties, useMemo } from 'react';
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
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  Text,
  TextVariants,
  Title,
  TitleSizes,
  Alert,
} from '@patternfly/react-core';
import { LongArrowAltLeftIcon, ShareIcon } from '@patternfly/react-icons';

import { VoteCard } from 'components';
import { CommentsContainer } from 'containers/CommentsContainer';
import { postedOnFormater } from 'utils/postedOnFormater';
import { Link } from 'react-router-dom';

export const IdeaDetailPage = (): JSX.Element => {
  const postedOn = useMemo(() => postedOnFormater('6/12/2021'), []);

  return (
    <Grid hasGutter style={{ gap: '60px' }}>
      <GridItem span={9}>
        <Flex direction={{ default: 'column' }} flexWrap={{ default: 'nowrap' }}>
          <Flex spaceItems={{ default: 'spaceItems2xl' }}>
            <FlexItem>
              <Link to="/">
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
              <Breadcrumb>
                <BreadcrumbItem>Home</BreadcrumbItem>
                <BreadcrumbItem to="#">mdeshmuk</BreadcrumbItem>
                <BreadcrumbItem to="#">#03</BreadcrumbItem>
              </Breadcrumb>
            </FlexItem>
            <FlexItem>
              <Text component={TextVariants['small']}>{`Posted on ${postedOn}`}</Text>
            </FlexItem>
          </Flex>
          <FlexItem>
            <Alert
              variant="warning"
              title="This idea has been archived and is read-only."
              isInline
            />
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              An internal platform for associate run projects and experimentation
            </Title>
          </FlexItem>
          <FlexItem spacer={{ default: 'spacerXl' }}>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras volutpat egestas sem.
              Fusce cursus eros risus, in rutrum arcu luctus ullamcorper. Class aptent taciti
              sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer vel
              dui vel ex rhoncus tempus eu vel nibh. Mauris laoreet ligula sed aliquet fringilla. In
              hac habitasse platea dictumst. Curabitur ullamcorper tellus nec ante commodo
              dignissim. Ut ullamcorper metus enim, a aliquam elit facilisis ut. Nam eu sem sed dui
              facilisis tincidunt quis eu ligula. Nulla malesuada facilisis libero, sit amet
              scelerisque lacus pulvinar vitae. Nulla blandit maximus nunc, id gravida leo feugiat
              ut.
            </Text>
          </FlexItem>
          <Flex grow={{ default: 'grow' }} className="pf-u-mb-4xl">
            <CommentsContainer />
          </Flex>
        </Flex>
      </GridItem>
      <GridItem span={3}>
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            <VoteCard voteCount={100} voter="Mayur Deshmukh">
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
              {['Apps', 'Development Tools'].map((category) => (
                <Chip key={category} isReadOnly>
                  {category}
                </Chip>
              ))}
            </ChipGroup>
          </FlexItem>
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
            <FlexItem>
              <Title headingLevel="h6">Other links:</Title>
            </FlexItem>
            <FlexItem>
              <Button variant="plain" className="pf-u-p-0">
                More ideas from Mayur
              </Button>
            </FlexItem>
            <FlexItem>
              <Button variant="plain" className="pf-u-p-0">
                More popular ideas
              </Button>
            </FlexItem>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  );
};
