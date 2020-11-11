import React, { useEffect, useMemo, useState } from 'react';
import { useMachine } from 'idaho/react';
import { machine, StateReturns } from './machine';
import { Selector } from './pages/selector';
import { Capture } from './pages/capture';
import { Images } from './pages/images';
import { VideoUI } from './pages/video';

function App() {
    const [stateName, state] = useMachine(machine);

    type typeChanger = typeof machine['states'][typeof stateName];

    switch (stateName) {
        case 'select':
            return (
                <Selector
                    stateChanger={(state as unknown) as StateReturns['select']}
                />
            );
        // case 'media':
        //     return (
        //         <Capture
        //             stateChanger={(state as unknown) as StateReturns['media']}
        //         />
        //     );
        case 'folder':
            return (
                <Images
                    stateChanger={(state as unknown) as StateReturns['folder']}
                />
            );
        // case 'video':
        //     return (
        //         <VideoUI
        //             stateChanger={(state as unknown) as StateReturns['video']}
        //         />
        //     );
    }
}

export default App;
