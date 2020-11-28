import React, { useEffect, useState } from 'react';
import { Menu, Icon } from 'semantic-ui-react';

import { Images } from '../../components/images';
import { VideoUI } from '../../components/video';

import styles from './main.module.css';
import { useLiveQuery } from 'dexie-react-hooks';
import { addImageDirectory, db } from '../../data';
import { Route, useParams } from 'react-router-dom';
import { Source } from '../../data/types';

type Params =
    | {
          id: string;
          type: 'image-folder' | 'video';
      }
    | {
          id: undefined;
          type: undefined;
      };

type SourceCheckProps = {
    sources: Source[] | undefined;
};

const ImagesOrError = (props: SourceCheckProps) => {
    const { sources } = props;
    const { id } = useParams<Params>();
    const [permissionState, setPermissionState] = useState<PermissionState>(
        'prompt'
    );
    const [requestAgain, setRequestAgain] = useState(0);

    const source = sources?.find((source) => source.id === id);

    useEffect(() => {
        console.log('requesting permission');
        source?.handle.requestPermission().then(setPermissionState);
    }, [source, requestAgain]);

    if (source === undefined || source.type !== 'image-folder') {
        return <div>Error</div>;
    }

    if (permissionState === 'prompt' || permissionState === 'denied') {
        return (
            <button onClick={() => setRequestAgain(requestAgain + 1)}>
                Request Permission
            </button>
        );
    }

    return <Images source={source} />;
};

const VideoOrError = (props: SourceCheckProps) => {
    const { sources } = props;
    const { id } = useParams<Params>();

    const source = sources?.find((source) => source.id === id);

    if (source === undefined || source.type !== 'video') {
        return <div>Error</div>;
    }

    return <VideoUI source={source} />;
};

export function Main() {
    const sources = useLiveQuery(() => db.sources.toArray(), []);

    const { id } = useParams<Params>();
    let source: Source | undefined;

    if (id && sources) {
        source = sources.find((source) => source.id === id);
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Menu vertical>
                    {sources ? (
                        sources.map((source) => (
                            <Menu.Item
                                as="a"
                                href={`/${source.type}/${source.id}`}
                                key={source.id}
                            >
                                {source.title}
                                <Icon
                                    name={
                                        source.type === 'image-folder'
                                            ? 'folder'
                                            : 'video'
                                    }
                                />
                            </Menu.Item>
                        ))
                    ) : (
                        <Menu.Item>Loading...</Menu.Item>
                    )}
                    <Menu.Item
                        onClick={async () => {
                            const handle = await window.showDirectoryPicker();
                            addImageDirectory(handle);
                        }}
                    >
                        <span>
                            <Icon name="add circle" />
                            Add Folder
                        </span>
                    </Menu.Item>
                    <Menu.Item
                        onClick={async () => {
                            // const [handle] = await window.showOpenFilePicker();
                            // db.sources.add({
                            //     id: uuid(),
                            //     handle: handle,
                            //     type: 'video',
                            //     title: handle.name,
                            //     dateAdded: new Date(),
                            // });
                        }}
                    >
                        <span>
                            <Icon name="add circle" />
                            Add Video
                        </span>
                    </Menu.Item>
                </Menu>
            </div>
            <div className={styles.content}>
                <Route path="/:type/:id">
                    <ImagesOrError sources={sources} />
                </Route>
                <Route path="/video/:id">
                    <VideoOrError sources={sources} />
                </Route>
            </div>
        </div>
    );
}
