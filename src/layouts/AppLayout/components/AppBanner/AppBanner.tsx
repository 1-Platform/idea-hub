import {
  Flex,
  FlexItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';

import style from './appBanner.module.scss';

export const AppBanner = (): JSX.Element => {
  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }}>
      <FlexItem spacer={{ default: 'spacerLg' }}>
        <img src="/images/innovation_logo.svg" className={style.logo} />
      </FlexItem>
      <FlexItem>
        <Title
          headingLevel="h6"
          size={TitleSizes['3xl']}
          className="pf-u-pb-md pf-u-font-weight-light"
        >
          Innovation Hub
        </Title>
        <TextContent>
          <Text component={TextVariants.small}>
            A place to share your ideas and find other passionate people
          </Text>
        </TextContent>
      </FlexItem>
    </Flex>
  );
};
