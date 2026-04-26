import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { env } from 'process';
import cors from 'cors';
import { createToken, decodeToken, tokenToAccount } from './tokens.js';
import { idToUser, usernameToUser } from './users.js';
import crypto from 'crypto';
import http from 'http';
import auth from './routes/auth.js';
import { pool } from './db.js';
import { Server } from 'socket.io';

const app = express();
const port = 3233;
const socketPort = 3234;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: env.CORS_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(express.json());

if (env.CORS_URL)
    app.use(cors({
        origin: env.CORS_URL,
        credentials: true,
    }));

app.get('/', (req, res) => {
    res.send('SecretCurse boilerplate :P');
});

app.get('/ping', (req, res) => {
    res.send({ pong: 'pong!' });
});

// Auth

app.use('/auth', auth.router);

// SocketIO

const matchQueue = [];
const authorization = new Map();

function strictEvent(socket, ev, callback, onFailure=undefined) {
    socket.on(ev, (...args) => {
        if (!authorization.has(socket.id)) {
            if (onFailure !== undefined)
                onFailure(...args);
            else
                socket.emit("authorization-error", "Socket is not authorized");
            return;
        }

        callback(authorization.get(socket.id), ...args);
    });
}

io.on('connection', (socket) => {
    console.log('Connection established.');

    socket.on('disconnect', function () {
        if (authorization.has(socket.id))
            authorization.delete(socket.id);
        console.log('Socket disconnected.');
    });

    socket.on('authorize', async (token) => {
        let user;
        try {
            user = await tokenToAccount(token, pool);
        } catch (e) {
            socket.emit("authorization-error", "Token is invalid")
            return;
        }

        authorization.set(socket.id, user.id);
        socket.emit("authorization", "Socket authorized");
    });

    strictEvent(socket, "me", (id, resolve) => {
        idToUser(id, pool).then((usr) => resolve({
            user: { username: usr.username }
        }));
    }, (resolve) => resolve({ error: "Socket is not authorized" }));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.listen(socketPort, () => {
    console.log(`Websocket is running on port ${socketPort}`);
});
