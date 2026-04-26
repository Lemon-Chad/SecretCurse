import jwt from 'jsonwebtoken';
import { env } from 'process';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = env.JWT_SECRET;
const JWT_ALG = env.JWT_ALG;

export function createToken(userId, minutes) {
    const time = Date.now();

    const payload = {
        "sub": userId,
        "iat": time,
        "exp": time + minutes * 60 * 1000,
        "type": "access",
    };

    return jwt.sign(payload, JWT_SECRET, { algorithm: JWT_ALG });
}

export function decodeToken(token) {
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET, { algorithms: [ JWT_ALG ] });
    } catch (e) {
        throw new Error("Invalid token");
    }

    if (payload?.type !== "access")
        throw new Error("Invalid token type");

    const sub = payload?.sub;
    if (sub == null)
        throw new Error("Missing subject");

    return Number(sub);
}


export async function tokenToAccount(token, pool) {
    let userId;
    try {
        userId = decodeToken(token);
    } catch (e) {
        throw new Error("Invalid or expired access token");
    }

    const rows = (await pool.query("SELECT * FROM accounts WHERE id = ?", [userId]))[0];
    if (rows.length == 0)
        throw new Error("User not found");
    return rows[0];
}
