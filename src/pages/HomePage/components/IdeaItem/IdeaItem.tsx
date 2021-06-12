import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    CardActions,
    Dropdown,
    DropdownItem,
    KebabToggle,
    CardTitle,
    Flex,
    FlexItem,
    Title,
    Button,
    Text,
    TextVariants,
} from '@patternfly/react-core';
import CommentsIcon from '@patternfly/react-icons/dist/js/icons/comment-icon';

import styles from './ideaItem.module.scss';

export const IdeaItem = (): JSX.Element => {
    const dropdownItems = [
        <DropdownItem key="link">Link</DropdownItem>,
        <DropdownItem key="action" component="button">
            Action
        </DropdownItem>,
        <DropdownItem key="disabled link" isDisabled>
            Disabled Link
        </DropdownItem>,
        <DropdownItem key="disabled action" isDisabled component="button">
            Disabled Action
        </DropdownItem>,
    ];
    return (
        <Card>
            <CardBody>
                <Flex>
                    <Flex
                        direction={{ default: 'column' }}
                        alignItems={{ default: 'alignItemsCenter' }}
                        justifyContent={{ default: 'justifyContentCenter' }}
                    >
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            <Title headingLevel="h1" style={{ color: '#5C5C5C' }}>
                                100
                            </Title>
                        </FlexItem>
                        <FlexItem>
                            <Button variant="secondary" className={styles.voteButton}>
                                <Text component={TextVariants.small}>VOTE</Text>
                            </Button>
                        </FlexItem>
                    </Flex>
                    <Flex flex={{ default: 'flex_1' }}>
                        <Card isPlain className="w-full">
                            <CardHeader className="p-0 pb-3">
                                <CardTitle className={styles.truncatedTitle}>
                                    An internal platform for associate run projects and
                                    experimentation
                                </CardTitle>
                                <CardActions>
                                    <Dropdown
                                        toggle={<KebabToggle className="p-0" />}
                                        isOpen={false}
                                        isPlain
                                        dropdownItems={dropdownItems}
                                        position={'right'}
                                    />
                                </CardActions>
                            </CardHeader>
                            <CardFooter className="p-0">
                                <Flex alignItems={{ default: 'alignItemsCenter' }}>
                                    <FlexItem>
                                        <Text component={TextVariants.small}>2 days ago</Text>
                                    </FlexItem>
                                    <FlexItem flex={{ default: 'flex_1' }}>
                                        <Text component={TextVariants.small}>
                                            Submitted by:{' '}
                                            <span className="text-bold">Mayur Deshmukh</span>
                                        </Text>
                                    </FlexItem>
                                    <Flex
                                        spacer={{ default: 'spacerSm' }}
                                        alignItems={{ default: 'alignItemsCenter' }}
                                    >
                                        <FlexItem>
                                            <CommentsIcon
                                                color="#5C5C5C"
                                                style={{ opacity: 0.5 }}
                                            />
                                        </FlexItem>
                                        <FlexItem>
                                            <Text component={TextVariants.small}>6 comments</Text>
                                        </FlexItem>
                                    </Flex>
                                </Flex>
                            </CardFooter>
                        </Card>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    );
};
