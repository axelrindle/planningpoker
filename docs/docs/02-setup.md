---
sidebar_label: 📥 Installation
---

# Installation

It is recommended to setup an installation via Docker. These repository provides two separate images:

```
ghcr.io/axelrindle/planningpoker/backend
```

```
ghcr.io/axelrindle/planningpoker/frontend
```

Use the [example docker-compose.yml](https://github.com/axelrindle/planningpoker/blob/main/docker/docker-compose.yml) as a configuration reference:

```yml showLineNumbers title="docker-compose.yml"
name: poker

services:
  backend:
    image: ghcr.io/axelrindle/planningpoker/backend:latest
    restart: always
    ports:
      - 3000:3000
      - 3001:3001
    volumes:
      - backend_data:/data

  frontend:
    image: ghcr.io/axelrindle/planningpoker/frontend:latest
    restart: always
    ports:
      - 3002:8080
    environment:
      - REACT_APP_API_URL=http://127.0.0.1:3000

volumes:
  backend_data:
```
