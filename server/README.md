# Server Structure

Two-way communication with [SocketIO](https://www.fullstack.com/labs/resources/blog/develop-a-chat-application-using-react-express-and-socket-io).

**Client Port:** `3232`

**Server Port:** `3233`

**Socket Port:** `3234`

## Login/Registration

`POST auth/login` takes `{ username: string; password: string; } and returns `{ access_token: string | null; error: string | null }`.

`POST auth/register` takes `{ username: string; password: string; } and returns `{ access_token: string | null; error: string | null }`.

`GET auth/me` requires `Authorization: Bearer token` header, and returns data about the corresponding user.

## Matchmaking

First, socket needs authorization.

Client socket connects, and sends token to `authorization`.

Any authorization errors are sent to `authorization-error` from the server.

- Connect to `enter-matchmaking`

- Server adds client to matchmaking queue

- When another client joins, pop both from queue and respond to both with match found signal, and username of other person.

## Board State Communication

TBD
