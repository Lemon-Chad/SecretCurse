import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import mysql from 'mysql2';
import { env } from 'process';
import cors from 'cors';
import { createToken, decodeToken, tokenToAccount } from './tokens.js';


const app = express();
const port = 3233;


app.use(express.json());

console.log(env.CORS_URL);
if (env.CORS_URL)
    app.use(cors({
        origin: env.CORS_URL,
        credentials: true,
    }));

const pool = mysql.createPool({
    host: env.MYSQL_HOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PSWD,
    database: 'secret_curses',
}).promise();


async function getCurrentAccount(req, res) {
    const authorization = req.get("Authorization");
    if (!authorization) {
        res.status(401).send("Authorization header missing");
        return null;
    }

    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        res.status(401).send("Invalid Authorization header");
        return null;
    }

    const token = parts[1];
    let user;
    try {
        user = await tokenToAccount(token, pool);
    } catch (e) {
        res.status(401).send(e.message);
        return null;
    }
    
    return user;
}

function requiresAccount(callback) {
    return (req, res) => {
        getCurrentAccount(req, res).then(usr => {
            if (usr !== null) callback(req, res, usr);
        });
    }
}


app.get('/', (req, res) => {
    res.send('SecretCurse boilerplate :P');
});

app.get('/ping', (req, res) => {
    res.send({ pong: 'pong!' });
});

app.post('/login', (req, res) => {
    console.log(req);
    console.log(res);
    res.send({
        access_token: "failure",
        refresh_token: "failure",
    });
});

app.get('/auth/me', requiresAccount((req, res, usr) => {
    res.send({
        username: usr.username
    });
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

