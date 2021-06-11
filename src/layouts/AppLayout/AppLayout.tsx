import { FC } from 'react';
import { Page, PageSection } from '@patternfly/react-core';

import { Container } from 'components';

export const AppLayout: FC = ({ children }) => {
    return (
        <Page>
            <Container>
                <PageSection>Header</PageSection>
                {children}
                <PageSection>Footer</PageSection>
            </Container>
        </Page>
    );
};
