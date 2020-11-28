import React, { useEffect, useState } from 'react';
import { Frame } from '../../data/types';

import styles from './images.module.css';

type Props = {
    frame: Frame;
    className?: string;
};

export const Image = (props: Props) => {
    const { frame } = props;

    const [url, setUrl] = useState<string | undefined>();

    useEffect(() => {
        frame.handle.getFile().then((blob) => {
            const url = URL.createObjectURL(blob);
            setUrl(url);
        });
    }, [frame.handle]);

    if (url) {
        return (
            <div className={styles.row}>
                <img src={url} alt="" />
                {frame.analysis ? (
                    <svg height="480px" width="640px" viewBox="0 0 640 480">
                        <path
                            strokeWidth="3"
                            stroke="black"
                            fill="none"
                            d={`M ${frame.analysis
                                .map((item) => [item[0], item[1]].join(','))
                                .join(' L ')}`}
                        />
                    </svg>
                ) : (
                    'awaiting analysis'
                )}
            </div>
        );
    }
    return <div className={styles.row}>Loading image</div>;
};
