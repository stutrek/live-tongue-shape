import React from 'react';

import { Button, Grid } from 'semantic-ui-react';

import styles from './page.module.css';

type Props = {
    children: React.ReactNode;
    title: string;
};

export const Page = (props: Props) => (
    <div>
        <div className={styles.header}>
            <Button href="/" className={styles.backButton}>
                Back
            </Button>
            <h2>Real Time Tongue Tracer: {props.title}</h2>
        </div>
        <div>{props.children}</div>
    </div>
);
