import React, { SyntheticEvent, useCallback, useState } from 'react';
import './App.css';

import { Switch, Route, useHistory } from 'react-router-dom';
import { Main } from './pages/main';

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
                <Route path="/">
                    <Main />
                </Route>
            </div>
        </Switch>
    );
}
