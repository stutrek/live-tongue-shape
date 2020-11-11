import { Machine, Control, useHistory, useEffect } from 'idaho';

type StateControl = Control<typeof states, 'select', never>;

const select = (control: StateControl) => {
    return {
        selectMedia: () => {
            control.transition('media');
        },
        selectFolder: () => {
            control.transition('folder');
        },
        selectVideo: () => {
            control.transition('video');
        },
    };
};

const genericState = (control: StateControl) => {
    return {
        returnToSelection: () => {
            control.transition('select');
        },
    };
};

const states = {
    select,
    media: genericState,
    folder: genericState,
    video: genericState,
};

export type States = typeof states;

export type StateReturns = {
    [T in keyof States]: ReturnType<States[T]>;
};

export type StatesEnum = StateReturns[keyof StateReturns];

export const machine = new Machine(states, 'select');
