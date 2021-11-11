import { useMemo, useState, MouseEventHandler, Fragment } from 'react';

import {
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  KebabToggle,
  Flex,
  FlexItem,
  Title,
  Button,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { CommentsIcon } from '@patternfly/react-icons';

import { useToggle } from 'hooks';
import { postedOnFormater } from 'utils/postedOnFormater';

import styles from './ideaItem.module.scss';

interface Props {
  voteCount: number;
  hasVoted?: boolean;
  title: string;
  postedOn: string | number;
  user: string;
  commentCount: number;
  onVoteClick: () => Promise<void> | void;
  onEditIdeaClick?: () => Promise<void> | void;
  onArchiveButtonClick?: () => Promise<void> | void;
  isArchived?: boolean;
}

export const IdeaItem = ({
  voteCount,
  hasVoted,
  title,
  postedOn,
  user,
  commentCount,
  onVoteClick,
  onEditIdeaClick,
  onArchiveButtonClick,
  isArchived,
}: Props): JSX.Element => {
  const { isOpen, handleToggle } = useToggle(false);
  const [isVoting, setIsVoting] = useState(false);

  /**
   * This function is used to convert the postedOn prop to formated string as shown in return
   * Reference: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript
   * @returns {String} : 2 days ago, 2 months ago, 5 years ago
   */
  const postedOnFormated = useMemo((): string => postedOnFormater(postedOn), [postedOn]);
  const userinfo = window.OpAuthHelper.getUserInfo();

  const handleVoteClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setIsVoting(true);
    await onVoteClick();
    setIsVoting(false);
  };

  const dropdownItems = [
    isArchived ? (
      <Fragment key="link" />
    ) : (
      <DropdownItem key="link" component="button" onClick={onEditIdeaClick}>
        Edit my idea
      </DropdownItem>
    ),
    <DropdownItem
      key="action"
      component="button"
      style={{ color: '#D30000' }}
      onClick={onArchiveButtonClick}
    >
      {isArchived ? 'Unarchive my idea' : 'Archive my idea'}
    </DropdownItem>,
  ];

  return (
    <Card>
      <CardBody>
        <Flex flexWrap={{ default: 'nowrap' }}>
          <Flex
            direction={{ default: 'column' }}
            alignItems={{ default: 'alignItemsCenter' }}
            justifyContent={{ default: 'justifyContentCenter' }}
          >
            <FlexItem spacer={{ default: 'spacerSm' }}>
              <Title headingLevel="h1" style={{ color: '#5C5C5C' }}>
                {voteCount}
              </Title>
            </FlexItem>
            <FlexItem>
              <Button
                variant="secondary"
                isSmall
                isDanger={hasVoted}
                className={styles.voteButton}
                onClick={handleVoteClick}
                isDisabled={isVoting}
                isLoading={isVoting}
              >
                <Text component={TextVariants.small}>{hasVoted ? 'VOTED' : 'VOTE'}</Text>
              </Button>
            </FlexItem>
          </Flex>
          <Flex direction={{ default: 'column' }} style={{ width: '90%' }}>
            <Flex
              alignItems={{ default: 'alignItemsFlexStart' }}
              flexWrap={{ default: 'nowrap' }}
              spacer={{ default: 'spacerSm' }}
            >
              <Flex style={{ minWidth: 0 }} grow={{ default: 'grow' }}>
                <Title headingLevel="h1" className={styles.truncatedTitle}>
                  {title}
                </Title>
              </Flex>
              <FlexItem>
                {user === userinfo.fullName && (
                  <Dropdown
                    toggle={
                      <KebabToggle
                        className="pf-u-p-0"
                        onToggle={handleToggle}
                        onClick={(event) => event.preventDefault()}
                      />
                    }
                    isOpen={isOpen}
                    onSelect={handleToggle}
                    isPlain
                    dropdownItems={dropdownItems}
                    position="left"
                    onClick={(event) => event.preventDefault()}
                  />
                )}
              </FlexItem>
            </Flex>
            <Flex alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Text component={TextVariants.small}>{postedOnFormated}</Text>
              </FlexItem>
              <FlexItem flex={{ default: 'flex_1' }}>
                <Text component={TextVariants.small}>
                  Submitted by: <span className="pf-u-font-weight-bold">{user}</span>
                </Text>
              </FlexItem>
              <Flex spacer={{ default: 'spacerSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                <Flex spacer={{ default: 'spacerSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <CommentsIcon color="#5C5C5C" style={{ opacity: 0.5 }} />
                </Flex>
                <FlexItem>
                  <Text component={TextVariants.small}>{`${commentCount} comments`}</Text>
                </FlexItem>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};
