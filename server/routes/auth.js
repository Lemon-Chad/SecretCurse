import express from 'express';
import { createToken, decodeToken, tokenToAccount } from '../tokens.js';
import { usernameToUser } from '../users.js';
import crypto from 'crypto';
import { pool } from '../db.js';

const router = express.Router();

export async function getCurrentAccount(req, res) {
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

export function requiresAccount(callback) {
    return (req, res) => {
        getCurrentAccount(req, res).then(usr => {
            if (usr !== null) callback(req, res, usr);
        });
    }
}

router.post('/login', async (req, res) => {
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

router.post('/register', async (req, res) => {
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

router.get('/me', requiresAccount((req, res, usr) => {
    res.send({
        username: usr.username
    });
}));

export default {
    router
};
