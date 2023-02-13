# WebSocket Communication API

The backend and frontend communicate in realtime via a WebSocket connection. They use a defined set of events to exchange data and decide what to do.

## Authentication

In case a Room is private, it's WebSocket connection must be authorized. This is handled via the
Http Header `Authorization`. The password must be sent in combination with the `Bearer` authentication scheme.

All unauthorized connections will be closed immediately.

## Data Structure

All data is exchanged in the JSON format.

The following resembles the basic data structure:

```ts
{
    userId?: string
    event: string
    data: {}
}
```

The `userId` attribute is only sent by the frontend and required to identify the user. It consists of a v4 UUID.

The `event` attribute specifies the current event type.

The `data` attribute may hold any additional data depending on the event type.

## Events

### Backend

The backend may send the following events:

| Event  | Description                                                                   |
| ------ | ----------------------------------------------------------------------------- |
| HELLO  | Sent once a connection has been established and assigns the user a unique ID. |
| UPDATE | Delivers the current game state when it changes.                              |
| DELETE | A room has been deleted.                                                      |

#### Examples

##### Initial welcome

```ts
{
    event: 'HELLO',
    data: {
        userId: 'uuid'
    }
}
```

##### Player join / quit

```ts
{
    event: 'UPDATE',
    data: {
        state: 'CHOOSE',
        users: [
            {
                name: 'Player 1',
                chosen: false
            },
            {
                name: 'Player 2',
                chosen: false
            }
        ]
    }
}
```

##### All players selected a card

```ts
{
    event: 'UPDATE',
    data: {
        state: 'SHOW',
        users: [
            {
                name: 'Player 1',
                chosen: true,
                card: 2
            },
            {
                name: 'Player 2',
                chosen: true,
                card: 2
            }
        ]
    }
}
```

### Frontend

The backend may send the following events:

| Event  | Description                                          |
| ------ | ---------------------------------------------------- |
| SELECT | Tells the backend that a player has selected a card. |

#### Examples

##### Card selection

```ts
{
    userId: '644c8082-bcc1-42a1-a1e9-5268bac9df88',
    event: 'SELECT',
    data: {
        cardId: 2
    }
}
```
