import { FC, Children as ReactChildren, ReactElement } from 'react';

import {
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Text,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';

import { Button as VoteCardUtilButton } from './components';

interface Props {
  voteCount: number;
  onVoteClick?: () => void | Promise<void>;
  voter: string;
}

interface CompoundComponents {
  Button: typeof VoteCardUtilButton;
}

export const VoteCard: FC<Props> & CompoundComponents = ({
  voteCount,
  onVoteClick,
  voter,
  children,
}) => {
  const buttonChildren: ReactElement[] = [];

  ReactChildren.forEach(children as ReactElement, (child: ReactElement) => {
    console.log(child.type);
    if (child.type === VoteCardUtilButton) {
      buttonChildren.push(child);
    }
  });

  return (
    <Card>
      <CardBody>
        <Flex
          direction={{ default: 'column' }}
          flexWrap={{ default: 'nowrap' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          <FlexItem spacer={{ default: 'spacerNone' }}>
            <Title
              headingLevel="h6"
              size={TitleSizes['4xl']}
              className="pf-u-font-weight-light pf-u-color-300"
            >
              {voteCount}
            </Title>
          </FlexItem>
          <FlexItem>
            <Text className="pf-u-font-weight-light pf-u-color-400">votes</Text>
          </FlexItem>
          <FlexItem>
            <Button variant="secondary" isLarge onClick={onVoteClick} className="rounded">
              VOTE
            </Button>
          </FlexItem>
          <FlexItem spacer={{ default: 'spacerXs' }}>
            <Text component={TextVariants.small} className="pf-u-color-400">
              Idea posted by
            </Text>
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h6">{voter}</Title>
          </FlexItem>
          <Flex
            justifyContent={{ default: 'justifyContentCenter' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            {buttonChildren}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

VoteCard.Button = VoteCardUtilButton;
