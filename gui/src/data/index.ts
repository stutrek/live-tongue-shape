import { v4 as uuid } from 'uuid';

import { MtrackerDB } from './db';
import { Socket, useSocketState as useSocketStateImpl } from './socket';
import { Frame } from './types';

export const db = new MtrackerDB('mtracker');
export const socket = new Socket(db);

export const useSocketState = () => useSocketStateImpl(socket);

export const addImageDirectory = async (handle: FileSystemDirectoryHandle) => {
    const parentId = uuid();

    const frames: Frame[] = [];
    for await (const entry of handle.values()) {
        if (entry instanceof FileSystemFileHandle) {
            if (/\.(jpg|jpeg|png|gif)$/.test(entry.name)) {
                frames.push({
                    id: uuid(),
                    parentId,
                    handle: entry,
                    filename: entry.name,
                    hasAnalysis: 0,
                    dateAdded: new Date(),
                });
            }
        }
    }
    db.transaction('rw', [db.sources, db.frames], () => {
        db.sources.add({
            id: parentId,
            handle: handle,
            type: 'image-folder',
            title: handle.name,
            dateAdded: new Date(),
        });
        db.frames.bulkAdd(frames);
    });
};
