import React from 'react';

import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeader,
    EuiPageContentHeaderSection,
    EuiTitle,
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
} from '@elastic/eui';

type Props = {
    children: React.ReactNode;
    title: string;
};

export const Page = (props: Props) => (
    <EuiPage>
        <EuiPageBody component="div">
            <EuiPageContent hasShadow={false} borderRadius="none">
                <EuiPageContentHeader>
                    <EuiFlexGroup>
                        <EuiFlexItem grow={false}>
                            <EuiButton href="/">Back</EuiButton>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiPageContentHeaderSection>
                                <EuiTitle>
                                    <h2>
                                        Real Time Tongue Tracer: {props.title}
                                    </h2>
                                </EuiTitle>
                            </EuiPageContentHeaderSection>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageContentHeader>
                <EuiPageContentBody>{props.children}</EuiPageContentBody>
            </EuiPageContent>
        </EuiPageBody>
    </EuiPage>
);
