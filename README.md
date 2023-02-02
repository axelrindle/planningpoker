<img src="./art/icon/web/icon-192.png" alt="icon" align="right" />

# Planning Poker

[![CI](https://github.com/axelrindle/planningpoker/actions/workflows/ci.yml/badge.svg)](https://github.com/axelrindle/planningpoker/actions/workflows/ci.yml)

> Planning Poker application intended to be selfhosted.

## Installation

It is recommended to setup an installation via Docker. These repository provides two separate images:

```
ghcr.io/axelrindle/planningpoker/backend
```

```
ghcr.io/axelrindle/planningpoker/frontend
```

Use the [example docker-compose.yml](https://github.com/axelrindle/planningpoker/blob/main/docker/docker-compose.yml) as a configuration reference.

## Configuration

Configuration is done via environment variables. Entries without a default value are required to be defined by you.

### Backend

| Variable            | Default                   | Description                                                                                                                               |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| PP_DATA_DIRECTORY   |                           | Where to store application data.                                                                                                          |
| PP_SERVER_HOST      | `0.0.0.0`                 | The host the server will listen on.                                                                                                       |
| PP_SERVER_PORT      | `3000`                    | The port the server will listen on.                                                                                                       |
| PP_LOG_LEVEL        | `info`                    | What kind of information to log. May be one of `error`, `warn`, `info` or `debug`.                                                        |
| PP_LOG_TIMESTAMP    | `DD.MM.YYYY HH:mm:ss.SSS` | How to format timestamps in the log.                                                                                                      |
| PP_LOG_HTTP_ENABLED | `true`                    | Whether to log Http requests.                                                                                                             |
| PP_LOG_HTTP_FORMAT  | `short`                   | What to include in Http logs. [See here](https://github.com/expressjs/morgan#predefined-formats) for available formats and customization. |

Default configuration and available environment variables can be found in the [backend/config directory](https://github.com/axelrindle/planningpoker/tree/main/packages/backend/config).

### Frontend

| Variable          | Default | Description                                     |
| ----------------- | ------- | ----------------------------------------------- |
| REACT_APP_API_URL |         | The full url the backend is accessible through. |

## License

[GPLv3](LICENSE)
