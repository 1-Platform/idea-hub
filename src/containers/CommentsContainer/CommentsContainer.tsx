import { ReactNode } from 'react';

import {
  Avatar,
  Button,
  Bullseye,
  Dropdown,
  DropdownItem,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextInput,
  Title,
  TitleSizes,
} from '@patternfly/react-core';

import { CommentField } from 'components';
import { useToggle } from 'hooks';
import { SortAmountDownIcon } from '@patternfly/react-icons';

interface Props {
  children?: ReactNode;
}

export const CommentsContainer = ({}: Props): JSX.Element => {
  const { isOpen, handleToggle } = useToggle(false);

  const dropdownItems = [
    <DropdownItem key="sort-new" component="button" className="pf-u-color-400">
      Newest First
    </DropdownItem>,
    <DropdownItem key="top-comments" component="button" className="pf-u-color-400">
      Top Comments
    </DropdownItem>,
  ];

  return (
    <Stack hasGutter className="pf-u-w-100">
      <StackItem>
        <Split hasGutter>
          <SplitItem className="pf-u-mr-lg">
            <Title headingLevel="h5" size={TitleSizes['lg']}>
              3 responses
            </Title>
          </SplitItem>
          <SplitItem>
            <Bullseye>
              <Dropdown
                toggle={
                  <Button
                    variant="link"
                    className="pf-u-p-0 pf-u-color-400"
                    onClick={handleToggle}
                    icon={<SortAmountDownIcon />}
                    iconPosition="right"
                  >
                    Sort by
                  </Button>
                }
                isOpen={isOpen}
                onSelect={handleToggle}
                isPlain
                dropdownItems={dropdownItems}
                position="left"
              />
            </Bullseye>
          </SplitItem>
        </Split>
      </StackItem>
      <StackItem>
        <Split hasGutter>
          <SplitItem>
            <Avatar
              src="https://www.patternfly.org/v4/images/avatarImg.6daf7202106fbdb9c72360d30a6ea85d.svg"
              alt="user-avater"
              aria-label="user image"
            />
          </SplitItem>
          <SplitItem isFilled>
            <TextInput
              aria-label="new comment"
              placeholder="Share your thoughts about Mayur’s idea…"
              allowFullScreen
            />
          </SplitItem>
        </Split>
      </StackItem>
      <StackItem>
        <CommentField commenterName="Rigin Oomen" createdAt="6/12/2021">
          <Text aria-label="comment-content">
            I like this idea a lot! Definitely worth exploring.
          </Text>
          <CommentField.CommentButton>Like</CommentField.CommentButton>
          <CommentField.CommentButton>Reply</CommentField.CommentButton>
        </CommentField>
      </StackItem>
      <StackItem>
        <CommentField commenterName="Rigin Oomen" createdAt="6/12/2021">
          <Text aria-label="comment-content">
            I like this idea a lot! Definitely worth exploring.
          </Text>
          <CommentField.CommentButton>Like</CommentField.CommentButton>
          <CommentField.CommentButton>Reply</CommentField.CommentButton>
        </CommentField>
      </StackItem>
    </Stack>
  );
};
