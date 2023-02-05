---
sidebar_label: 🎈 Configuration
---

# Configuration

Configuration is done via environment variables. Entries without a default value are required to be defined by you.

### Backend

| Variable                 | Default                     | Description                                                                                                                               |
| ------------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| PP_DATA_DIRECTORY        | `/data` (Docker image only) | Where to store application data.                                                                                                          |
| PP_SERVER_HOST           | `0.0.0.0`                   | The host the server will listen on.                                                                                                       |
| PP_SERVER_PORT           | `3000`                      | The port the server will listen on.                                                                                                       |
| PP_SERVER_PORT_WEBSOCKET | `3001`                      | The port the WebSocket server will listening on.                                                                                          |
| PP_LOG_LEVEL             | `info`                      | What kind of information to log. May be one of `error`, `warn`, `info` or `debug`.                                                        |
| PP_LOG_TIMESTAMP         | `DD.MM.YYYY HH:mm:ss.SSS`   | How to format timestamps in the log.                                                                                                      |
| PP_LOG_HTTP_ENABLED      | `true`                      | Whether to log Http requests.                                                                                                             |
| PP_LOG_HTTP_FORMAT       | `short`                     | What to include in Http logs. [See here](https://github.com/expressjs/morgan#predefined-formats) for available formats and customization. |

Default configuration and available environment variables can be found in the [backend/config directory](https://github.com/axelrindle/planningpoker/tree/main/packages/backend/config).

In a normal setup there is no need to change any of the default settings.

### Frontend

| Variable          | Default | Description                                     |
| ----------------- | ------- | ----------------------------------------------- |
| REACT_APP_API_URL |         | The full url the backend is accessible through. |
