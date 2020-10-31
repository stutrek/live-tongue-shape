import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStore, ModifierGenerator } from './useLocalStore';

type SocketState = {
    isOpen: boolean;
    isAttemptingToConnect: boolean;
    nextConnectionAttempt: Date;
};

const socketModifiers: ModifierGenerator<SocketState> = () => ({
    setOpen(state) {
        console.log('setting open', state);
        return {
            isOpen: true,
            isAttemptingToConnect: false,
        };
    },
    setClosed(state) {
        console.log('setting closed');
        return {
            isOpen: false,
            isAttemptingToConnect: true,
            nextConnectionAttempt: new Date(Date.now() + 1000),
        };
    },
});

export const useSocket = (messageCallback: WebSocket['onmessage']) => {
    const socketRef = useRef<WebSocket>();
    const [socketState, socketApi] = useLocalStore(
        {
            isOpen: false,
            isAttemptingToConnect: true,
            nextConnectionAttempt: new Date(),
        },
        socketModifiers
    );
    useEffect(() => {
        console.log('setting timeout');
        let timeout: ReturnType<typeof setTimeout> | undefined = setTimeout(
            () => {
                console.log('running');
                let failCount = 0;
                timeout = undefined;
                socketRef.current = new WebSocket(`ws://localhost:8088/socket`);
                socketRef.current.onmessage = messageCallback;
                socketRef.current.onopen = () => {
                    console.log('onopen');
                    failCount = 0;
                    socketApi.setOpen();
                };
                socketRef.current.onclose = () => {
                    console.log('onclose');
                    failCount += 1;
                    socketApi.setClosed();
                };
                socketRef.current.onerror = () => {
                    console.log('onerror');
                    socketApi.setClosed();
                };
            },
            socketState.nextConnectionAttempt.valueOf() - Date.now()
        );

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            } else if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [socketState.nextConnectionAttempt]);

    const send = useMemo(
        () => (message: ArrayBuffer | Blob | string) => {
            if (socketRef.current === undefined) {
                return;
            }
            socketRef.current.send(message);
        },
        []
    );

    return [send, socketState] as const;
};
