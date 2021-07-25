import { Flex, FlexItem, Text, TextContent, TextVariants } from '@patternfly/react-core';

export const Footer = (): JSX.Element => {
  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }}>
      <Flex flex={{ default: 'flex_1' }}>
        <FlexItem>
          <TextContent>
            <Text component={TextVariants.p} className="pf-u-font-size-xs">
              <span className="pf-u-mr-md">
                Developer and Maintained by the{' '}
                <span className="pf-u-font-weight-bold">One Platform Team</span>
              </span>
              <span className="pf-u-mr-md">Internal use only</span>
              Find out more about similar associate run projects
            </Text>
          </TextContent>
        </FlexItem>
      </Flex>
      <FlexItem spacer={{ default: 'spacerLg' }}>
        <img src="images/redhat.svg" alt="Red Hat" />
      </FlexItem>
    </Flex>
  );
};
