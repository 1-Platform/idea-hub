import { Flex, FlexItem, Tab, Tabs, TabTitleText, TextInput } from '@patternfly/react-core';
import { TabType } from 'pages/HomePage/types';

interface Props {
  handleTabChange: (tabIndex: number) => void;
  tab: TabType;
}

export const MenuTab = ({ handleTabChange, tab }: Props): JSX.Element => {
  return (
    <Flex className="pf-u-h-full" alignItems={{ default: 'alignItemsCenter' }}>
      <Flex flex={{ default: 'flex_2' }}>
        <FlexItem>
          <Tabs
            onSelect={(event, tabIndex) => handleTabChange(tabIndex as number)}
            activeKey={tab.tabIndex}
          >
            <Tab eventKey={0} title={<TabTitleText>Recent</TabTitleText>}></Tab>
            <Tab eventKey={1} title={<TabTitleText>Popular</TabTitleText>}></Tab>
          </Tabs>
        </FlexItem>
      </Flex>
      <Flex flex={{ default: 'flex_1' }}>
        <TextInput
          placeholder="Looking for an idea!"
          type="search"
          aria-label="Search ideas"
          id="search-bar"
          iconVariant="search"
          style={{ borderColor: '#EEEEEE' }}
        />
      </Flex>
    </Flex>
  );
};
