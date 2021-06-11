import { FC } from 'react';
import { Flex, FlexItem, Page, PageSection } from '@patternfly/react-core';

import { Container } from 'components';

import { AppBanner } from './components/AppBanner';
import { Footer } from './components/Footer';

import styles from './appLayout.module.scss';

export const AppLayout: FC = ({ children }) => {
    return (
        <Page>
            <Container>
                <Flex direction={{ default: 'column' }} className="h-full">
                    <FlexItem className={styles.banner}>
                        <PageSection padding={{ default: 'padding' }}>
                            <AppBanner />
                        </PageSection>
                    </FlexItem>
                    <Flex direction={{ default: 'column' }} flex={{ default: 'flex_1' }}>
                        <FlexItem>{children}</FlexItem>
                    </Flex>
                    <FlexItem className={styles.footer}>
                        <PageSection padding={{ default: 'padding' }}>
                            <Footer />
                        </PageSection>
                    </FlexItem>
                </Flex>
            </Container>
        </Page>
    );
};
