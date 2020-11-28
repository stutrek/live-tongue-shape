export type FolderSource = {
    id: string;
    handle: FileSystemDirectoryHandle;
    type: 'image-folder';
    title: string;
    dateAdded: Date;
};

export type VideoSource = {
    id: string;
    handle: FileSystemFileHandle;
    type: 'video';
    title: string;
    dateAdded: Date;
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
