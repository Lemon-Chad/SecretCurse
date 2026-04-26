
export async function usernameToUser(username, pool) {
    const users = (await pool.query("SELECT * FROM accounts WHERE username = ?", [username]))[0];
    if (users.length === 0)
        return null;
    return users[0];
}
