import React, { SyntheticEvent, useCallback, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Rnd } from 'react-rnd';

import { db } from '../../data';
import { FolderSource, Source } from '../../data/types';
import { useImageUrl } from './useImageUrl';
import styles from './cropper.module.css';
import { Button } from 'semantic-ui-react';

type Props = {
    source: FolderSource;
};

type RemoveUndefined<T> = T extends undefined ? never : T;

const CropImage = ({ className }: { className: string }) => (
    <svg
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={className}
        preserveAspectRatio="none"
    >
        <rect
            width="100"
            height="100"
            style={{ stroke: 'rgb(0, 0, 0)', fill: 'none' }}
        ></rect>
        <rect
            width="100"
            height="100"
            style={{
                strokeDasharray: '5, 5',
                fill: 'rgb(113, 113, 113)',
                fillOpacity: 0.2,
                stroke: 'rgb(255, 255, 255)',
            }}
        ></rect>
        <path
            style={{ fill: 'rgb(216, 216, 216)', fillOpacity: 0.41 }}
            transform="matrix(-0.577454, -0.000019, 0.000028, -0.73033, 330.758514, 315.369537)"
            d="M 572.802 408.602083275 A 173.174 173.174 0 0 1 399.628 408.602083275 L 464.134 296.874413882 A 44.162 44.162 0 0 0 508.296 296.874413882 Z"
            data-bx-shape="pie 486.215 258.629 44.162 173.174 150 210 1@5195af7b"
        ></path>{' '}
    </svg>
);

export const Cropper = (props: Props) => {
    const { source } = props;
    const frame = useLiveQuery(
        () => db.frames.where('parentId').equals(source.id).first(),
        [source.id]
    );
    const url = useImageUrl(frame);

    const [location, setLocation] = useState<
        RemoveUndefined<Source['cropLocation']>
    >(
        source.cropLocation || {
            top: 100,
            left: 100,
            width: 200,
            height: 200,
        }
    );

    const [touched, setTouched] = useState(false);

    const save = useCallback(
        (event: SyntheticEvent<HTMLButtonElement>) => {
            const updatedSource = {
                ...source,
                cropLocation: location,
                shareable: event.currentTarget.name === 'improve',
            };
            db.sources.put(updatedSource);
        },
        [db, location]
    );

    if (!frame || !url) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h2>Please select the ultrasound fan</h2>
            <img src={url} alt="" className={styles.image} />
            <Rnd
                default={{
                    x: location.left,
                    y: location.top,
                    width: location.width,
                    height: location.height,
                }}
                onDragStop={(event, data) => {
                    setTouched(true);
                    setLocation({
                        ...location,
                        left: data.x,
                        top: data.y,
                    });
                }}
                onResizeStop={(event, dir, ref) => {
                    setTouched(true);
                    setLocation({
                        ...location,
                        width: ref.clientWidth,
                        height: ref.clientHeight,
                    });
                }}
            >
                <div />
                <CropImage className={styles.fan} />
            </Rnd>
            {touched && (
                <div>
                    <p className={styles.help}>
                        If there is no PII, please consider sharing the data
                        within the crop zone to help us improve.
                    </p>
                    <Button primary name="improve" onClick={save}>
                        Save and improve
                    </Button>
                    <Button basic name="stagnate" onClick={save}>
                        Save and stagnate
                    </Button>
                </div>
            )}
        </div>
    );
};
