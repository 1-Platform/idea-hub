import { Flex, FlexItem, Tab, Tabs, TabTitleText, TextInput } from '@patternfly/react-core';

export const MenuTab = (): JSX.Element => {
  return (
    <Flex className="pf-u-h-full" alignItems={{ default: 'alignItemsCenter' }}>
      <Flex flex={{ default: 'flex_2' }}>
        <FlexItem>
          <Tabs defaultActiveKey={0}>
            <Tab eventKey={0} title={<TabTitleText>Recent</TabTitleText>}></Tab>
            <Tab eventKey={1} title={<TabTitleText>Popular</TabTitleText>}></Tab>
          </Tabs>
        </FlexItem>
      </Flex>
      <Flex flex={{ default: 'flex_1' }}>
        <TextInput
          placeholder="Looking for an idea!"
          type="search"
          iconVariant="search"
          style={{ borderColor: '#EEEEEE' }}
        />
      </Flex>
    </Flex>
  );
};
