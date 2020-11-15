import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from 'semantic-ui-react';

import styles from './selector.module.css';

type Props = {
    setHandle: (
        handle: FileSystemFileHandle | FileSystemDirectoryHandle
    ) => void;
};

export const Selector = (props: Props) => {
    return (
        <div className={styles.container}>
            <h1>Tongue Tracer</h1>
            <Button
                href="/video"
                fluid
                onClick={async () => {
                    const [handle] = await window.showOpenFilePicker();
                    props.setHandle(handle);
                }}
            >
                Select a video
            </Button>
            <br />
            <Button
                href="/images"
                fluid
                onClick={async () => {
                    const handle = await window.showDirectoryPicker();
                    props.setHandle(handle);
                }}
            >
                Select a folder of images
            </Button>
            <br />
            <Button href="/capture" fluid>
                Capture a window
            </Button>
        </div>
    );
};
