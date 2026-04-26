import crypto from 'crypto';

const TOKEN_KEY = "secret_curses_token";

let token: string | null = null;

const BASE_URL = process.env.REACT_APP_API_URL;

export function loadToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(t: string | null) {
    token = t;
    if (t)
        localStorage.setItem(TOKEN_KEY, t);
    else
        localStorage.removeItem(TOKEN_KEY);
}

function headers() {
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
}

async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: headers(),
    });

    if (res.ok) {
        const data = await res.json();
        return data as T;
    }

    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? data.message ?? `HTTP ${res.status}`);
}

async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body),
    });

    if (res.ok) return (await res.json()) as T;

    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? data.message ?? `HTTP ${res.status}`);
}

const api = {
    ping: async () => await get<{ pong: string }>('/ping'),

    login: async (username: string, password: string): Promise<{ access_token: string | null; error: string | null; }> => {
        const result = await post<{
            access_token: string | null;
            error: string | null;
        }>('/auth/login', {
            username,
            password,
        });

        setToken(result.access_token);

        return {
            access_token: result.access_token,
            error: result.error,
        };
    },

    register: async (username: string, password: string): Promise<{ access_token: string | null, error: string | null; }> => {
        const result = await post<{
            access_token: string | null;
            error: string | null;
        }>('/auth/register', { username, password });

        setToken(result.access_token);

        return { 
            access_token: result.access_token,
            error: result.error
        };
    },

    me: async(): Promise<User> => {
        return get<User>('/auth/me');
    }
};

export {
    api
};

export type User = {
    username: string;
};
