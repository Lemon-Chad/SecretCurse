import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import mysql from 'mysql2';
import { env } from 'process';
import cors from 'cors';
import { createToken, decodeToken, tokenToAccount } from './tokens.js';
import { usernameToUser } from './users.js';
import crypto from 'crypto';

const app = express();
const port = 3233;

app.use(express.json());

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

app.post('/auth/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password || username.length == 0 || password.length == 0)
        return res.send({ access_token: null, error: "Missing username/password" });

    const user = await usernameToUser(username, pool);
    if (!user)
        return res.send({ access_token: null, error: "Username not found" });

    const hashedPswd = crypto.createHash("md5").update(password).digest("hex");
    if (hashedPswd !== user.password)
        return res.send({ access_token: null, error: "Invalid password" });

    return res.send({ access_token: createToken(user.id, 365 * 24 * 60), error: null })
});

app.post('/auth/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password || username.length == 0 || password.length == 0)
        return res.send({ access_token: null, error: "Missing username/password" });

    if (await usernameToUser(username, pool))
        return res.send({ access_token: null, error: "Username is already taken" });

    const user = await pool.query(
        "INSERT INTO accounts (username, password) VALUES (?, ?)",
        [username, crypto.createHash('md5').update(password).digest("hex")]
    );

    return res.send({ access_token: createToken(user[0].insertId, 365 * 24 * 60), error: null })
});

app.get('/auth/me', requiresAccount((req, res, usr) => {
    res.send({
        username: usr.username
    });
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

