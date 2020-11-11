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

export const Selector = () => (
    <EuiPage>
        <EuiPageBody component="div">
            <EuiPageContent
                verticalPosition="center"
                horizontalPosition="center"
            >
                <EuiPageContentHeader>
                    <EuiPageContentHeaderSection>
                        <EuiTitle>
                            <h2>Real Time Tongue Tracer</h2>
                        </EuiTitle>
                    </EuiPageContentHeaderSection>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                    <EuiFlexGroup direction="column">
                        <EuiFlexItem grow={true}>
                            <EuiButton href="/video">Select a video</EuiButton>
                        </EuiFlexItem>
                        <EuiFlexItem grow={true}>
                            <EuiButton href="/images">
                                Select a folder of images
                            </EuiButton>
                        </EuiFlexItem>
                        <EuiFlexItem grow={true}>
                            <EuiButton href="/capture">
                                Capture a window
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageContentBody>
            </EuiPageContent>
        </EuiPageBody>
    </EuiPage>
);
