import { Flex, FlexItem, Text, TextContent, TextVariants } from '@patternfly/react-core';

export const Footer = (): JSX.Element => {
    return (
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
            <Flex flex={{ default: 'flex_1' }}>
                <FlexItem>
                    <TextContent>
                        <Text component={TextVariants.p} className="text-small">
                            <span className="mr-4">
                                Developer and Maintained by the{' '}
                                <span className="text-bold">One Platform Team</span>
                            </span>
                            <span className="mr-4">Internal use only</span>
                            Find out more about similar associate run projects
                        </Text>
                    </TextContent>
                </FlexItem>
            </Flex>
            <FlexItem spacer={{ default: 'spacerLg' }}>
                <img src="/images/redhat.svg" />
            </FlexItem>
        </Flex>
    );
};
