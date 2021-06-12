import { Flex, FlexItem, Tab, Tabs, TabTitleText, TextInput } from '@patternfly/react-core';

export const MenuTab = (): JSX.Element => {
    return (
        <Flex>
            <Flex grow={{ default: 'grow' }}>
                <FlexItem>
                    <Tabs defaultActiveKey={0}>
                        <Tab eventKey={0} title={<TabTitleText>Recent</TabTitleText>}></Tab>
                        <Tab eventKey={1} title={<TabTitleText>Popular</TabTitleText>}></Tab>
                    </Tabs>
                </FlexItem>
            </Flex>
            <FlexItem>
                <TextInput placeholder="Looking for an idea!" type="search" iconVariant="search" />
            </FlexItem>
        </Flex>
    );
};
