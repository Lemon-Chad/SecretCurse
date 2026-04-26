
export async function usernameToUser(username, pool) {
    const users = (await pool.query("SELECT * FROM accounts WHERE username = ?", [username]))[0];
    if (users.length === 0)
        return null;
    return users[0];
}

export async function idToUser(id, pool) {
    const users = (await pool.query("SELECT * FROM accounts WHERE id = ?", [id]))[0];
    if (users.length === 0)
        return null;
    return users[0];
}
