import { useLiveQuery } from 'dexie-react-hooks';
import React, { useEffect } from 'react';
import { db, socket } from '../../data';
import { FolderSource } from '../../data/types';
import { Cropper } from './cropper';

import { Image } from './image';
import { ImageList } from './imageList';

type Props = {
    source: FolderSource;
};

export const Images = (props: Props) => {
    if (props.source.cropLocation === undefined) {
        return <Cropper source={props.source} />;
    }

    return <ImageList {...props} />;
};
