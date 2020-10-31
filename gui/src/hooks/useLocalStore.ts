/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from 'react';

type OmitFirstArgAndRemoveReturn<F> = F extends (
    x: any,
    ...args: infer P
) => any
    ? (...args: P) => void
    : never;
type TrailingArgs<F> = F extends (x: any, ...args: infer P) => any ? P : never;

type AllowedReturnValues<T> =
    | Partial<T>
    | Promise<Partial<T>>
    | undefined
    | Promise<undefined>
    | void
    | Promise<void>;

type AllowedNewStateArgs<T> =
    | Partial<T>
    | Promise<Partial<T>>
    | undefined
    | Promise<undefined>
    | null
    | Promise<void>;

type ModifierMethod<T> = (state: T, ...args: any) => AllowedReturnValues<T>;

export type Modifiers<T> = Record<string, ModifierMethod<T>>;

export type ModifierGenerator<T> = (
    setState: (newState: AllowedNewStateArgs<T>) => void,
    getState: () => T
) => Modifiers<T>;

type ModifiersReturn<Modifiers> = {
    [K in keyof Modifiers]: OmitFirstArgAndRemoveReturn<Modifiers[K]>;
};

// type ActionEnum<Modifiers> =
export const useLocalStore = <State>(
    initialState: State,
    modifierGenerator: ModifierGenerator<State>
) => {
    const [state, doSetState] = useState(initialState);

    const stateRef = useRef(state);
    let inProgress = false;
    let stateChangePending = false;

    const setState = useMemo(
        () => (newState?: AllowedNewStateArgs<State>) => {
            if (newState) {
                if (newState instanceof Promise) {
                    // @ts-ignore
                    newState.then(setState);
                    return;
                }
                const nextState = {
                    ...stateRef.current,
                    ...newState,
                };
                stateRef.current = nextState;
                if (!inProgress) {
                    doSetState(nextState);
                } else {
                    stateChangePending = true;
                }
            }
        },
        [doSetState]
    );

    const api = useMemo(() => {
        const modifiers = modifierGenerator(setState, () => stateRef.current);
        const api: ModifiersReturn<typeof modifiers> = {};
        for (const key in modifiers) {
            api[key] = (
                ...args: TrailingArgs<typeof modifiers[typeof key]>
            ) => {
                const nextState = modifiers[key](stateRef.current, ...args);
                if (nextState) {
                    inProgress = true;
                    setState(nextState);
                    inProgress = false;
                    if (stateChangePending) {
                        doSetState(stateRef.current);
                    }
                }
            };
        }
        return api;
    }, [setState, modifierGenerator]);

    return [state, api] as const;
};
