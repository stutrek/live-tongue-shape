import { useLiveQuery } from 'dexie-react-hooks';
import React, { useEffect } from 'react';
import { db, socket } from '../../data';
import { FolderSource } from '../../data/types';

import { Image } from './image';

type Props = {
    source: FolderSource;
};

export const Images = (props: Props) => {
    const frames = useLiveQuery(
        () => db.frames.where('parentId').equals(props.source.id).toArray(),
        [props.source.id]
    );

    useEffect(() => {
        if (frames) {
            for (const frame of frames) {
                if (frame.hasAnalysis === 0) {
                    console.log(frame, 'adding image to batch');
                    frame.handle.getFile().then((file) => {
                        socket.processImage(frame);
                    });
                }
            }
        }
    }, [frames === undefined]);

    if (!frames) {
        return <div>Loading folder</div>;
    }

    return (
        <div>
            {frames.map((frame) => (
                <Image frame={frame} key={frame.id} />
            ))}
        </div>
    );
};
