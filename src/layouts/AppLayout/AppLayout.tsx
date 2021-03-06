import { FC } from 'react';
import { Flex, FlexItem, Page, PageSection } from '@patternfly/react-core';

import { Container } from 'components';

import { AppBanner } from './components/AppBanner';
import { Footer } from './components/Footer';

import styles from './appLayout.module.scss';

export const AppLayout: FC = ({ children }) => {
  return (
    <Page mainContainerId="app-layout-page" className={styles['app-layout']}>
      <Container>
        <Flex
          direction={{ default: 'column' }}
          className="pf-u-h-100"
          flexWrap={{ default: 'nowrap' }}
        >
          <FlexItem>
            <PageSection padding={{ default: 'padding' }} className={styles.banner}>
              <AppBanner />
            </PageSection>
          </FlexItem>
          <Flex direction={{ default: 'column' }} flex={{ default: 'flex_1' }}>
            {children}
          </Flex>
          <FlexItem>
            <PageSection padding={{ default: 'padding' }} className={styles.footer}>
              <Footer />
            </PageSection>
          </FlexItem>
        </Flex>
      </Container>
    </Page>
  );
};
