import { useEffect, useState } from 'react';

type VideoState = {
    url: string;
    type: string;
};

export const useVideo = (handle: FileSystemFileHandle | undefined) => {
    const [url, setUrl] = useState<VideoState>({
        url: '',
        type: '',
    });

    useEffect(() => {
        (async () => {
            if (handle === undefined) {
                return;
            }

            const file = await handle.getFile();
            console.log({ file });
            const url = URL.createObjectURL(file);
            setUrl({
                url,
                type: file.type,
            });
        })();
    }, [handle]);

    return [url] as const;
};
