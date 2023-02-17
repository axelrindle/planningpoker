---
toc_max_heading_level: 4
---

# Source Code Structure

This project uses [lerna](https://lerna.js.org/) for multi-package management.

All relevant packages are stored within the `packages` directory.

Documentation is stored separately within the `docs` directory.

## Backend

The backend provides the core functionality of the application. This is also the place
where the WebSocket communication is handled.

### Sourcecode Overview

It is written in TypeScript and run using Node.js. Deno support is neither tested nor guaranteed.

All source code is located in the `src` directory.

The top-level contains core and utility logic.

The core architecture follows the MVC pattern and makes use of express.js and various middlewares.

#### app

The `app` directory contains all the express server logic.

The names of directories and files are pretty self-explanatory.

#### service

The `service` directory contains all the services used in dependency injection, for example
the database client.

#### util

The  `util` directory contains reusable utility functions for various tasks.

## Frontend

In short the frontend provides comfortable access for users to interact with the backend. It is the
place where the actual estimations are taking place.

### Sourcecode Overview

It is also written in TypeScript and makes use of the [React project](https://reactjs.org).
[Create React App](https://create-react-app.dev) is currently used as a development framework.

All source code is located within the `src` directory. The main entrypoint is the `index.tsx` file.

#### assets

Contains static assets like fonts and images.

#### components

Contains reusable components like buttons, input fields and modals.

#### layouts

Provides generic layouts for use by different pages.

#### modals

Contains specialized modal implementations.

#### pages

Contains all the pages accessible by users.

#### query

Contains query definitions for use with the [@tanstack/query](https://tanstack.com/query) library.

#### store

Contains the [Redux Datastore](https://react-redux.js.org) implementation used for global storage
of reusable data and configuration.

Configuration is furtherly stored within the local storage of the web browser.

#### util

This directory contains reusable utility functions and helpers.
