import { Children as ReactChildren, useMemo, ReactElement, FC } from 'react';

import { Avatar, Flex, FlexItem, Text, TextVariants } from '@patternfly/react-core';

import { postedOnFormater } from 'utils/postedOnFormater';
import { CommentButton } from './components/CommentButton';

interface Props {
  commenterName: string;
  avatar?: string;
  createdAt: number;
}

interface CompoundComponents {
  CommentButton: typeof CommentButton;
}

export const CommentField: FC<Props> & CompoundComponents = ({
  commenterName,
  avatar,
  createdAt,
  children: propChildren,
}) => {
  const buttonChildren: ReactElement[] = [];
  const children: ReactElement[] = [];

  const postedOn = useMemo(() => postedOnFormater(createdAt), [createdAt]);

  ReactChildren.forEach(propChildren as ReactElement, (child: ReactElement) => {
    if (child.type === CommentButton) {
      buttonChildren.push(child);
    } else {
      children.push(child);
    }
  });

  return (
    <Flex flexWrap={{ default: 'nowrap' }} alignItems={{ default: 'alignItemsFlexStart' }}>
      <FlexItem>
        <Avatar
          src={
            avatar ||
            'https://www.patternfly.org/v4/images/avatarImg.6daf7202106fbdb9c72360d30a6ea85d.svg'
          }
          alt="avatar"
          aria-label="commenter-name"
        />
      </FlexItem>
      <Flex
        grow={{ default: 'grow' }}
        direction={{ default: 'column' }}
        flexWrap={{ default: 'nowrap' }}
        spaceItems={{ default: 'spaceItemsXs' }}
      >
        <Flex>
          <FlexItem>
            <Text component={TextVariants.small}>{commenterName}</Text>
          </FlexItem>
          <FlexItem>
            <Text component={TextVariants.small} className="pf-u-color-400">
              {postedOn}
            </Text>
          </FlexItem>
        </Flex>
        <FlexItem>{children}</FlexItem>
        <Flex>{buttonChildren}</Flex>
      </Flex>
    </Flex>
  );
};

CommentField.CommentButton = CommentButton;
