import React from 'react';

import { Button } from 'semantic-ui-react';

import styles from './selector.module.css';

export const Selector = () => (
    <div className={styles.container}>
        <h1>Tongue Tracer</h1>
        <Button href="/video" fluid>
            Select a video
        </Button>
        <br />
        <Button href="/images" fluid>
            Select a folder of images
        </Button>
        <br />
        <Button href="/capture" fluid>
            Capture a window
        </Button>
    </div>
);
