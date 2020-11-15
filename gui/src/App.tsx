import React, { SyntheticEvent, useCallback, useState } from 'react';
import './App.css';

import { Selector } from './pages/selector';
import { Capture } from './pages/capture';
import { Images } from './pages/images';
import { VideoUI } from './pages/video';

import { Switch, Route, useHistory } from 'react-router-dom';

export function App() {
    const [handle, setHandle] = useState<
        FileSystemDirectoryHandle | FileSystemFileHandle | undefined
    >(undefined);

    const history = useHistory();
    const handleClick = useCallback(
        (event: SyntheticEvent) => {
            if (event.target instanceof HTMLAnchorElement) {
                const href = event.target.getAttribute('href');
                if (href && href.startsWith('/')) {
                    console.log('pushing', href);
                    history.push(href);
                    event.preventDefault();
                }
            }
        },
        [history]
    );

    return (
        <Switch>
            <div onClick={handleClick}>
                <Route path="/capture">
                    <Capture />
                </Route>
                <Route path="/images">
                    {handle instanceof FileSystemDirectoryHandle ||
                    handle === undefined ? (
                        <Images handle={handle} />
                    ) : null}
                </Route>{' '}
                <Route path="/video">
                    {handle instanceof FileSystemFileHandle ? (
                        <VideoUI handle={handle} />
                    ) : null}
                </Route>
                <Route path="/" exact={true}>
                    <Selector setHandle={setHandle} />
                </Route>
            </div>
        </Switch>
    );
}
