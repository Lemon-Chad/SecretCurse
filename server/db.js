import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2';
import { env } from 'process';

const pool = mysql.createPool({
    host: env.MYSQL_HOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PSWD,
    database: 'secret_curses',
}).promise();

export {
    pool
};

export default {
    pool
};
