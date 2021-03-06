import { FC, Children as ReactChildren, ReactElement, CSSProperties, useState } from 'react';

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
  authorName: string;
  hasVoted?: boolean;
}

interface CompoundComponents {
  Button: typeof VoteCardUtilButton;
}

export const VoteCard: FC<Props> & CompoundComponents = ({
  voteCount,
  onVoteClick,
  authorName,
  hasVoted,
  children,
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const buttonChildren: ReactElement[] = [];

  ReactChildren.forEach(children as ReactElement, (child: ReactElement) => {
    if (child.type === VoteCardUtilButton) {
      buttonChildren.push(child);
    }
  });

  const handleVoteClick = async () => {
    setIsVoting(true);
    onVoteClick && (await onVoteClick());
    setIsVoting(false);
  };

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
          <FlexItem spacer={{ default: 'spacerLg' }}>
            <Button
              variant="secondary"
              onClick={handleVoteClick}
              isDanger={hasVoted}
              isLoading={isVoting}
              isDisabled={isVoting}
              className="pf-u-py-sm"
              style={{ '--pf-c-button--after--BorderRadius': '8px' } as CSSProperties}
            >
              {hasVoted ? 'VOTED' : 'VOTE'}
            </Button>
          </FlexItem>
          <FlexItem spacer={{ default: 'spacerXs' }}>
            <Text component={TextVariants.small} className="pf-u-color-400">
              Idea posted by
            </Text>
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h6">{authorName}</Title>
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
