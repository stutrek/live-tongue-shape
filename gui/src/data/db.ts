import Dexie from 'dexie';
import { Frame, Source } from './types';

export class MtrackerDB extends Dexie {
    constructor(name: string) {
        super(name);
        this.version(1).stores({
            sources: '&id, dateAdded, [type+dateAdded]',
            frames:
                '&id, [parentId+dateAdded], [parentId+hasResult+dateAdded], [hasResult+dateAdded]',
        });
        this.sources = this.table('sources');
        this.frames = this.table('frames');
    }
    sources: Dexie.Table<Source, string>;
    frames: Dexie.Table<Frame, string>;
}
