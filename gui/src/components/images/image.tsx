import React, { useEffect, useState } from 'react';

type Props = {
    handle: FileSystemFileHandle;
    className?: string;
};

export const Image = (props: Props) => {
    const [url, setUrl] = useState<string | undefined>();

    useEffect(() => {
        props.handle.getFile().then((blob) => {
            const url = URL.createObjectURL(blob);
            setUrl(url);
        });
    }, [props.handle]);

    if (url) {
        return <img src={url} className={props.className} />;
    }
    return <div>Loading image</div>;
};
