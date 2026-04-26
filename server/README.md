# Server Structure

Two-way communication with [SocketIO](https://www.fullstack.com/labs/resources/blog/develop-a-chat-application-using-react-express-and-socket-io).

**Client Port:** `3232`

**Server Port:** `3233`

## Login/Registration

`POST auth/login` takes `{ username: string; password: string; } and returns `{ access_token: string | null; error: string | null }`.

`POST auth/register` takes `{ username: string; password: string; } and returns `{ access_token: string | null; error: string | null }`.

`GET auth/me` requires `Authorization: Bearer token` header, and returns data about the corresponding user.

## Matchmaking

TBD

## Board State Communication

TBD
