import React from 'react';

import { Page } from '../../components/Page';
import { useVideo } from './useVideo';

type Props = {
    handle: FileSystemFileHandle | undefined;
};

export const VideoUI = (props: Props) => {
    const [{ url, type }] = useVideo(props.handle);
    console.log(url);
    return (
        <Page title="Video">
            {url !== '' ? (
                <video
                    controls
                    autoPlay
                    width="400"
                    onError={console.log}
                    onCanPlay={console.log}
                    onLoadedMetadata={console.log}
                    onInvalid={console.log}
                >
                    <source src={url} type={type} />
                </video>
            ) : null}
        </Page>
    );
};
