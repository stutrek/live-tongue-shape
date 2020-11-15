import { useEffect } from 'react';
import { useLocalStore } from '../../hooks/useLocalStore';

const initialState = {
    handle: null,
    images: [] as string[],
    results: {} as { [index: string]: string },
};

type State = typeof initialState;

const modifierGenerator = () => {
    return {
        saveImages: (state: State, images: State['images']) => {
            return {
                images,
            };
        },
    };
};

export const useImageStore = (
    handle: FileSystemDirectoryHandle | undefined
) => {
    const [store, modifiers] = useLocalStore(initialState, modifierGenerator);

    useEffect(() => {
        (async () => {
            if (handle === undefined) {
                return;
            }
            const imageUrls: string[] = [];
            for await (const entry of handle.values()) {
                if (entry.name.endsWith('.jpg')) {
                    // @ts-ignore
                    const blob = await entry.getFile();
                    const url = URL.createObjectURL(blob);
                    imageUrls.push(url);
                }
            }
            imageUrls.sort();
            modifiers.saveImages(imageUrls);
        })();
    }, [handle]);

    return [store, modifiers] as const;
};
