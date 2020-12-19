import { useEffect, useState } from 'react';
import { Frame } from '../../data/types';

export const useImageUrl = (frame: Frame | undefined) => {
    const [url, setUrl] = useState<string | undefined>();

    useEffect(() => {
        if (frame === undefined) {
            return;
        }
        frame.handle.getFile().then((blob) => {
            const url = URL.createObjectURL(blob);
            setUrl(url);
        });
    }, [frame && frame.handle]);

    return url;
};
