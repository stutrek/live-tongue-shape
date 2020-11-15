import React from 'react';

import { Page } from '../../components/Page';
import { useImageStore } from './imagesStore';

type Props = {
    handle: FileSystemDirectoryHandle | undefined;
};

export const Images = (props: Props) => {
    const [store, modifiers] = useImageStore(props.handle);

    return (
        <Page title="Image Folder">
            {store.images.map((url) => (
                <img src={url} key={url} />
            ))}
        </Page>
    );
};
