# REST API

The frontend interacts with the backend via it's RESTful API.

Base url is `/api`.

Path Variables are prefixed with a `:`.

## Rooms

### List

GET `/api/room`

Returns a list of all available Rooms.

### Read

GET `/api/room/:id`

Returns a single Room by it's id.

### Create

POST `/api/room`

Creates a new Room.

#### Body

Accepts: `application/json`, `application/x-www-form-urlencoded`

| Key         | Type   | Required? | Description                          |
| ----------- | ------ | --------- | ------------------------------------ |
| name        | string | ✔         | Room name.                           |
| description | string | ✖         | A short description.                 |
| userLimit   | number | ✖         | User limit. Minimum of 2.            |
| password    | string | ✖         | Room password. Makes a Room private. |

### Update

PUT `/api/room/:id`

Updates an existing Room.

#### Body

Accepts: `application/json`, `application/x-www-form-urlencoded`

Accepts the same properties as the [Create operation](#create) with the only difference everything being optional.

`undefined` as a value means don't change.

`null` as a value means remove/disable. E.g. sending `description: null` will remove the description.

### Delete

DELETE `/api/room/:id`

Deletes a Room.

If there are users connected to a Room they will be kicked out of it.

## Cards

TODO

## WebSocket

Realtime communication within a Room is handled via a WebSocket connection. While the WebSocket Communication API is described [in another document](./03-websocket.md), there are some REST endpoints regarding the connection establishment.

### Connection Url

GET `/api/socket`

Returns a url which may be used to open a WebSocket connection.
