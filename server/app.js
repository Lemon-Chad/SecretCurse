import express from 'express';
import path from 'path';
import mysql from 'mysql2';
import { env } from 'process';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

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


app.get('/', (req, res) => {
    res.send('SecretCurse boilerplate :P');
});

app.get('/ping', (req, res) => {
    res.send({ pong: 'pong!' });
});

app.post('/register', (req, res) => {
    console.log(req);
    console.log(res);
    res.send("Lol!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

