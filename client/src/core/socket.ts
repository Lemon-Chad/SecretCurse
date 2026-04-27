import { io } from 'socket.io-client';
import { loadToken, User } from './api';

const BASE_URL = process.env.REACT_APP_WSAPI_URL;

const socket = io(BASE_URL, {
    withCredentials: true
});

socket.on("authorization-error", (message: string) => {
    throw new Error(message);
});

let onMatchEnter = () => {};
socket.on("match-found", (opponent) => {
    matchState = {
        opponentUsername: opponent
    };

    onMatchEnter();
})

export type MatchState = {
    opponentUsername: string
};
let matchState: MatchState | null = null

const socketApi = {
    authorize: () => { 
        const token = loadToken();
        if (token)
            socket.emit('authorize', token); 
    },
    me: (): Promise<User> => {
        return new Promise((resolve, reject) => {
            socket.emit('me', (res: { user?: User, error?: string }) => {
                if (res.error)
                    reject(res.error);
                console.log(res.user);
                resolve(res.user!);
            });
        });
    },
    enterQueue: (): Promise<void> => {
        return new Promise((resolve, reject) => {
            socket.emit('enter-queue', (res: { status: string; error?: string }) => {
                if (res.status === "ok")
                    resolve();
                else
                    reject(res.error!);
            });
        })
    },
    exitQueue: (): Promise<void> => {
        return new Promise((resolve, reject) => {
            socket.emit('exit-queue', (res: { status: string; error?: string }) => {
                if (res.status === "ok")
                    resolve();
                else
                    reject(res.error!);
            });
        })
    },
    getMatchState: (): MatchState | null => matchState,
    matchFoundListener: (callback: () => void) => onMatchEnter = callback,
};

export { socketApi };
