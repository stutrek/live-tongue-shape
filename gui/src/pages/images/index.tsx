import React from 'react';

import { Page } from '../../components/Page';
import { useImageStore } from './imagesStore';

type Props = {
    handle: FileSystemDirectoryHandle | undefined;
};

export const Images = (props: Props) => {
    useImageStore(props.handle);

    return <Page title="Image Folder">hi</Page>;
};
