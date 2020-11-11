import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import './App.css';

import { Selector } from './pages/selector';
import { Capture } from './pages/capture';
import { Images } from './pages/images';
import { VideoUI } from './pages/video';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const handleClick = (event: SyntheticEvent) => {
    if (event.target instanceof HTMLAnchorElement) {
        if (event.target.href.startsWith('/')) {
            history.pushState(null, '', event.target.href); // eslint-disable-line
            event.preventDefault();
        }
    }
};

export function App() {
    return (
        <Router>
            <div onClick={handleClick}>
                <Switch>
                    <Route path="/capture">
                        <Capture />
                    </Route>
                    <Route path="/images">
                        <Images />
                    </Route>{' '}
                    <Route path="/video">
                        <VideoUI />
                    </Route>
                    <Route path="/">
                        <Selector />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
