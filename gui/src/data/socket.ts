import { useEffect, useState } from 'react';
import { MtrackerDB } from './db';
import { Frame } from './types';

type Result = number[][];

type SocketState = {
    isOpen: boolean;
    isAttemptingToConnect: boolean;
    nextConnectionAttempt: Date | undefined;
};

type QueueItem = {
    id: string;
    frame: Frame;
    resolve: (result: Result) => any;
    reject: (err: any) => any;
    promise: Promise<Result>;
};

class SocketStateChangeEvent extends Event {
    constructor(nextState: SocketState) {
        super('statechange');
        this.data = nextState;
    }

    data: SocketState;
}

type SocketEventMap = {
    statechange: SocketStateChangeEvent;
};

function processResult(string: string) {
    const rows = string.split('\n');
    rows.shift();
    return rows.map((row: string) =>
        row.split(',').map((number: string) => Number(number))
    );
}

export class Socket {
    constructor(private db: MtrackerDB) {}

    state: SocketState = {
        isOpen: false,
        isAttemptingToConnect: false,
        nextConnectionAttempt: undefined,
    };

    queue: QueueItem[] = [];
    socket: WebSocket | undefined;

    eventTarget = new EventTarget();

    addEventListener<K extends keyof SocketEventMap>(
        type: K,
        listener: (ev: SocketEventMap[K]) => any
    ) {
        return this.eventTarget.addEventListener(type, (event) => {
            if ('data' in event) {
                listener(event);
            }
        });
    }

    removeEventListener = this.eventTarget.removeEventListener;

    processImage(frame: Frame) {
        const itemInQueue = this.queue.find(
            (queueItem) => queueItem.id === frame.id
        );
        if (itemInQueue) {
            return itemInQueue.promise;
        }
        let resolve: (result: Result) => void, reject: (reason: Error) => void;
        const promise = new Promise<Result>(
            (internalResolve, internalReject) => {
                resolve = internalResolve;
                reject = internalReject;
            }
        );

        const queueItem = {
            id: frame.id,
            frame,
            // @ts-ignore
            resolve,
            // @ts-ignore
            reject,
            promise: promise,
        };

        this.queue.push(queueItem);
        if (this.queue.length === 1) {
            if (this.state.isOpen) {
                queueItem.frame.handle.getFile().then((file) => {
                    this.socket?.send(file);
                });
            } else {
                this.connect();
            }
        }

        return promise;
    }

    connect() {
        if (this.state.isOpen || this.state.isAttemptingToConnect) {
            return;
        }
        const nextState = {
            isOpen: false,
            isAttemptingToConnect: true,
            nextConnectionAttempt: undefined,
        };
        this.state = nextState;
        this.eventTarget.dispatchEvent(new SocketStateChangeEvent(nextState));
        // this.socket = new WebSocket(`ws://${window.location.host}/socket`);
        this.socket = new WebSocket(`ws://localhost:8088/socket`);
        this.socket.onmessage = (message: MessageEvent<string>) => {
            const result = processResult(message.data);
            const queueItem = this.queue.shift();
            if (queueItem) {
                queueItem.resolve(result);
                this.db.frames.put({
                    ...queueItem.frame,
                    hasAnalysis: 1,
                    analysis: result,
                    analysisCompletedDate: new Date(),
                });
            }

            if (this.queue.length) {
                this.queue[0].frame.handle.getFile().then((file) => {
                    this.socket?.send(file);
                });
            }
        };
        this.socket.onopen = () => {
            const nextState = {
                isOpen: true,
                isAttemptingToConnect: false,
                nextConnectionAttempt: undefined,
            };
            this.state = nextState;
            this.eventTarget.dispatchEvent(
                new SocketStateChangeEvent(nextState)
            );
            if (this.queue.length) {
                this.queue[0].frame.handle.getFile().then((file) => {
                    this.socket?.send(file);
                });
            }
        };
        this.socket.onclose = () => {
            const nextState = {
                isOpen: true,
                isAttemptingToConnect: false,
                nextConnectionAttempt: new Date(Date.now() + 1000),
            };
            this.state = nextState;
            this.eventTarget.dispatchEvent(
                new SocketStateChangeEvent(nextState)
            );
            setTimeout(() => this.connect(), 1000);
        };
        this.socket.onerror = () => {
            const nextState = {
                isOpen: true,
                isAttemptingToConnect: false,
                nextConnectionAttempt: new Date(Date.now() + 1000),
            };
            this.state = nextState;
            this.eventTarget.dispatchEvent(
                new SocketStateChangeEvent(nextState)
            );
            setTimeout(() => this.connect(), 1000);
        };
    }
}

export function useSocketState(socket: Socket) {
    const [socketState, setSocketState] = useState(socket.state);
    useEffect(() => {
        socket.addEventListener('statechange', (event) => {
            setSocketState(event.data);
        });
    }, [socket]);

    return socketState;
}
