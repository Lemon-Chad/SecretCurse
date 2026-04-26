import { io } from 'socket.io-client';
import { loadToken, User } from './api';

const BASE_URL = process.env.REACT_APP_WSAPI_URL;

const socket = io(BASE_URL, {
    withCredentials: true
});

socket.on("authorization-error", (message) => {
    throw new Error(message);
});

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
    }
};

export { socketApi };
