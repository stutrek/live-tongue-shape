import { useEffect } from 'react';
import { useLocalStore } from '../../hooks/useLocalStore';

export const useImageStore = (
    handle: FileSystemDirectoryHandle | undefined
) => {
    const [store, modifiers] = useLocalStore(
        {
            handle: null,
            images: [],
            results: {} as { [index: string]: string },
        },
        () => ({})
    );

    useEffect(() => {
        (async () => {
            if (handle === undefined) {
                return;
            }
            console.log(handle);
            for await (const entry of handle.values()) {
                console.log(entry);
            }
        })();
    }, [handle]);
};
