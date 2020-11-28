import React from 'react';

import { VideoSource } from '../../data/types';
import { useVideo } from './useVideo';

type Props = {
    source: VideoSource;
};

export const VideoUI = (props: Props) => {
    const [{ url, type }] = useVideo(props.source.handle);
    console.log(url);
    return url !== '' ? (
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
    ) : null;
};
