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
import CommentsIcon from '@patternfly/react-icons/dist/js/icons/comment-icon';

import { useToggle } from 'hooks';
import { useMemo } from 'react';

import styles from './ideaItem.module.scss';

interface Props {
  voteCount: number;
  hasVoted?: boolean;
  title: string;
  postedOn: string;
  user: string;
  commentCount: number;
}

export const IdeaItem = ({
  voteCount,
  hasVoted,
  title,
  postedOn,
  user,
  commentCount,
}: Props): JSX.Element => {
  const { isOpen, handleToggle } = useToggle(false);

  /**
   * This function is used to convert the postedOn prop to formated string as shown in return
   * Reference: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript
   * @returns {String} : 2 days ago, 2 months ago, 5 years ago
   */
  const postedOnFormated = useMemo((): string => {
    const present = new Date().getTime(); //Gets the number of milliseconds
    const inputDate = new Date(postedOn).getTime();
    const daysDiff = (present - inputDate) / (1000 * 3600 * 24);
    if (daysDiff < 30) {
      const day = Math.round(daysDiff);
      return `${day} ${day > 1 ? 'days' : 'day'} ago`;
    } else if (daysDiff < 365) {
      const month = Math.round(daysDiff / 30);
      return `${month} ${month > 1 ? 'months' : 'month'} ago`;
    } else {
      const year = Math.round(daysDiff / 365);
      return `${year} ${year > 1 ? 'years' : 'year'} ago`;
    }
  }, [postedOn]);

  const dropdownItems = [
    <DropdownItem key="link">Edit my idea</DropdownItem>,
    <DropdownItem key="action" component="button" style={{ color: '#D30000' }}>
      Archive my idea
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
              <Button variant="secondary" isDanger={hasVoted} className={styles.voteButton}>
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
              <Flex style={{ minWidth: 0 }}>
                <Title headingLevel="h1" className={styles.truncatedTitle}>
                  {title}
                </Title>
              </Flex>
              <FlexItem>
                <Dropdown
                  toggle={<KebabToggle className="pf-u-p-0" onToggle={handleToggle} />}
                  isOpen={isOpen}
                  onSelect={handleToggle}
                  isPlain
                  dropdownItems={dropdownItems}
                  position="left"
                />
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
