import React from 'react';

import { StateReturns } from '../../machine';

import { EuiButton } from '@elastic/eui';

type Props = {
    stateChanger: StateReturns['folder'];
};

export const Images = (props: Props) => {
    return (
        <div>
            <EuiButton onClick={() => props.stateChanger.returnToSelection()}>
                Return
            </EuiButton>
        </div>
    );
};
