type BaseSource = {
    id: string;
    title: string;
    dateAdded: Date;
    shareable?: boolean;
    cropLocation?: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
};

export type FolderSource = BaseSource & {
    handle: FileSystemDirectoryHandle;
    type: 'image-folder';
};

export type VideoSource = BaseSource & {
    handle: FileSystemFileHandle;
    type: 'video';
};

export type Source = FolderSource | VideoSource;

export type Frame = {
    id: string;
    parentId: string;
    handle: FileSystemFileHandle;
    filename: string;
    dateAdded: Date;
    hasAnalysis: number;
    analysis?: number[][];
    analysisCompletedDate?: Date;
};
