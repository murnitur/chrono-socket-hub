# ChronoSocketHub

ChronoSocketHub is a comprehensive wrapper that seamlessly integrates Socket.io with Agenda and BullMQ, providing a powerful, efficient, and versatile solution for real-time communication and job scheduling within Node.js applications. This package simplifies the orchestration of Socket.io events while harnessing the capabilities of Agenda for job scheduling and BullMQ for managing message queues, enabling developers to build robust, scalable, and time-sensitive applications with ease.

# Install

Install chrono-socket-hub using:

```zsh
npm i chrono-socket-hub
```

# How to use

## Setup a ChronoSocket instance:

```ts
import ChronoSocket from "chrono-socket-hub";

const chronoSocket = new ChronoSocket();
```

## ChronoSocketHub server

ChronoSocketHub introduces a built-in HTTP server, providing seamless integration for Node.js and Express applications. This feature enables developers to effortlessly incorporate ChronoSocketHub's functionalities into their existing Node.js or Express applications. By exposing a flexible HTTP server interface, developers can easily integrate ChronoSocketHub's powerful real-time communication capabilities, job scheduling with Agenda, and message queue management with BullMQ into their applications, ensuring a streamlined and efficient development experience.

```ts
const { server } = chronoSocket;

server.listen(80, () => {
  console.log("Server is running on port 80");
});
```

### Integrating with Express

For developers utilizing Express and having an `app` initialized via `express()`, integrating ChronoSocketHub is straightforward. Simply include ChronoSocketHub within the configuration settings of your Express application. By incorporating ChronoSocketHub into the configuration, users can seamlessly harness its functionalities alongside their Express app, enabling real-time communication, job scheduling, and message queue management within a unified ecosystem. This integration empowers developers to effortlessly leverage the capabilities of ChronoSocketHub while maintaining the robustness and flexibility of their Express-based applications.

```ts
import express from "express";
import ChronoSocket from "chrono-socket-hub";

const app = express();

const chronoSocket = new ChronoSocket({ app });
```

## Listening to client connections

Upon instantiation, ChronoSocketHub seamlessly initializes and begins listening for connections, streamlining the setup process for developers. This automatic functionality eliminates the need for explicit start commands, allowing users to focus on their application logic without the additional overhead of manual initialization. ChronoSocketHub, by default, activates its connection listening capabilities upon instantiation, ensuring a hassle-free integration experience for developers seeking immediate and effortless utilization of its real-time communication, job scheduling, and message queue management features within their applications.

## Configurations:

| Option       | Description                                                                                            | Default Value     | Data Type              |
| ------------ | ------------------------------------------------------------------------------------------------------ | ----------------- | ---------------------- |
| `agent`      | Defines the job scheduling agent for ChronoSocketHub (`agenda` or `bullmq`).                           | `agenda`          | `"agenda" \| "bullmq"` |
| `db`         | Specifies the database for Agenda or BullMQ.                                                           | `undefined`       | `string`               |
| `socketPath` | Specifies the path for the socket connection.                                                          | `/`               | `string`               |
| `origin`     | Sets the allowed origins for CORS (Cross-Origin Resource Sharing).                                     | `*`               | `string`               |
| `methods`    | Defines the allowed HTTP methods for CORS.                                                             | `['GET', 'POST']` | `string[]`             |
| `logging`    | Indicates whether logging is enabled.                                                                  | `true`            | `boolean`              |
| `app`        | Express application instance for integration.                                                          | `undefined`       | `Express`              |
| `volatile`   | Optimizes event transmission for scenarios where sending an event depends on client connection status. | `false`           | `boolean`              |

This table summarizes each configuration option available in ChronoSocketHub, providing insight into their descriptions, default values, and respective data types. Developers can adjust these settings according to their application requirements.
