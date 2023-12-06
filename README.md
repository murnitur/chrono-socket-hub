# ChronoSocketHub

`ChronoSocketHub` is a comprehensive wrapper that seamlessly integrates Socket.io with Agenda and BullMQ, providing a powerful, efficient, and versatile solution for real-time communication and job scheduling within Node.js applications. This package simplifies the orchestration of Socket.io events while harnessing the capabilities of Agenda for job scheduling and BullMQ for managing message queues, enabling developers to build robust, scalable, and time-sensitive applications with ease.

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

`ChronoSocketHub` introduces a built-in HTTP server, providing seamless integration for Node.js and Express applications. This feature enables developers to effortlessly incorporate `ChronoSocketHub`'s functionalities into their existing Node.js or Express applications. By exposing a flexible HTTP server interface, developers can easily integrate `ChronoSocketHub`'s powerful real-time communication capabilities, job scheduling with Agenda, and message queue management with BullMQ into their applications, ensuring a streamlined and efficient development experience.

```ts
const { server } = chronoSocket;

server.listen(80, () => {
  console.log("Server is running on port 80");
});
```

### Integrating with Express

For developers utilizing Express and having an `app` initialized via `express()`, integrating `ChronoSocketHub` is straightforward. Simply include `ChronoSocketHub` within the configuration settings of your Express application. By incorporating `ChronoSocketHub` into the configuration, users can seamlessly harness its functionalities alongside their Express app, enabling real-time communication, job scheduling, and message queue management within a unified ecosystem. This integration empowers developers to effortlessly leverage the capabilities of `ChronoSocketHub` while maintaining the robustness and flexibility of their Express-based applications.

```ts
import express from "express";
import ChronoSocket from "chrono-socket-hub";

const app = express();

const chronoSocket = new ChronoSocket({ app });
```

## Listening to client connections

Upon instantiation, `ChronoSocketHub` seamlessly initializes and starts listening for connections, streamlining the setup process for developers. This automatic functionality eliminates the need for explicit start commands, allowing users to focus on their application logic without the additional overhead of manual initialization. `ChronoSocketHub`, by default, activates its connection listening capabilities upon instantiation, ensuring a hassle-free integration experience for developers seeking immediate and effortless utilization of its real-time communication, job scheduling, and message queue management features within their applications.

Additionally, `ChronoSocketHub` inherently handles disconnections, automatically managing and responding to socket disconnect events. This built-in functionality ensures that disconnections are gracefully managed without requiring explicit developer intervention, maintaining the stability and reliability of real-time connections within the application.

### Listening for subscriptions

The `onSubscribe` function within `ChronoSocketHub` facilitates the listening process for subscriptions. This function internally observes the incoming `subscribe` events, exposing details about the client and the specific channel or channels being subscribed to. By utilizing `onSubscribe`, developers can seamlessly tap into the subscription process, gaining access to vital information regarding client activities and subscribed channels. This function acts as an internal listener, enabling developers to implement custom logic or behaviors tailored to specific channels or client subscriptions within their real-time communication infrastructure.

```ts
chronoSocket.onSubscribe((client, channel) => {
  console.log(`${client} has subscribed to ${channel}`);
});
```

### Listening to un-subscriptions

The `onUnSubscribe` function within `ChronoSocketHub` is designed to listen for un-subscription events from a channel or multiple channels. It allows developers to define a callback function that receives the client and the specific channel or channels being un-subscribed. Upon receiving an un-subscription event via the `un-subscribe` signal, this function triggers the defined callback, enabling developers to implement custom actions or logic in response to client un-subscriptions within the real-time communication framework.

```ts
chronoSocket.onUnSubscribe((client, channel) => {
  console.log(`${client} has left ${channel}`);
});
```

### Listening for messages

The `onMessage` function in `ChronoSocketHub` serves as a pivotal mechanism for message handling. This function operates as an internal listener, actively monitoring incoming `message` events within the application. It provides developers with access to both the sender client and the content of the messages being transmitted. By leveraging `onMessage`, developers gain the ability to intercept and process real-time messages, allowing for customized logic and tailored actions based on the received content. This function empowers developers to implement specific behaviors or reactions in response to messages sent between clients within their real-time communication ecosystem.

```ts
chronoSocket.onMessage((client, payload) => {
  console.log(`Message from: ${client}. Message content: ${payload}`);
});
```

### Send messages

The `sendMessage` function enables the transmission of messages to either a specified room or for broadcasting purposes. It requires the following parameters:

- `clientId`: Identification for the client socket intended to receive the message.
- `eventName`: Name of the event triggering the message.

- `payload`: Content of the message to be sent.

- `broadcast` (optional, defaults to `true`): Dictates whether the message will reach all occupants in the room, including the sender. Set to `false` for pinpointed communication within a specific room, excluding the sender.

- `room` (optional): Specifies the target room for the message. When `broadcast` is set to `true` and a `room` is specified, the message will be distributed to all individuals in that room, encompassing the sender. To exclude the sender from the recipients in the same room, toggle `broadcast` to `false`.

This function facilitates message delivery by first retrieving the socket associated with the provided client ID. It then proceeds to handle different scenarios based on the provided parameters, such as broadcasting the message to all clients, sending it exclusively to a specified room, or handling volatile message transmission if configured.

If the specified client socket is not found, an error message is logged, ensuring graceful error handling within the communication system.

```ts
chronoSocket.onMessage((client, payload) => {
  const { room } = payload;
  chronoSocket.sendMessage(client, "message", payload, true, room);
});
```

### Listening to custom events

The `on` method in `ChronoSocketHub` enables developers to create custom event listeners by specifying the event name and providing a corresponding callback function to handle these events. This method acts as a versatile mechanism, allowing the application to listen for user-defined events transmitted via the socket connection. By employing the `on` method, developers can register event-specific callbacks, ensuring that when a particular event is triggered, the associated callback function executes. This functionality enables developers to implement custom logic, execute actions, or trigger specific behaviors in response to user-defined events within their real-time communication infrastructure, offering a high degree of flexibility and customization.

```ts
chronoSocket.on("my-custom-event", (client, ...args) => {
  console.log("Managing my custom event!");
});
```

### Cancel an event listener

The process of removing an event listener in `ChronoSocketHub` involves the deliberate cessation of monitoring for a specific event. This action allows developers to deactivate the internal listener associated with a particular event, ceasing the observation and handling of incoming events related to the specified event type. By invoking the removal of an event listener, developers can effectively halt the custom logic or actions previously triggered upon the occurrence of the specified event. This functionality grants users precise control over event-based behaviors within their real-time communication infrastructure, facilitating the management and adjustment of event-specific functionalities as needed.

```ts
chronoSocket.removeListener("event-name", (client, ...args) => {
  console.log("event-name has been halted.");
});
```

### Cancel all event listeners

The ability to remove all event listeners in `ChronoSocketHub` offers developers a comprehensive means of halting the monitoring process for all registered events. This action effectively clears the internal event registry, ceasing the observation and handling of any incoming events across the application. By invoking the removal of all event listeners, developers can universally deactivate custom logic or actions associated with any previously registered events. This functionality empowers users to reset and reconfigure their real-time communication environment, providing a clean slate for event-based functionalities within their application.

```ts
// using symbols
chronoSocket.removeAllListener(Symbol("event-name"));

// using strings
chronoSocket.removeAllListener("event-name");
```

### Get all sockets

The `getSockets` function in `ChronoSocketHub` provides access to a Map containing socket connections. This function allows developers to retrieve and interact with an organized collection of active socket connections established within the `ChronoSocketHub` instance. Leveraging a Map data structure, `getSockets` enables developers to access, iterate through, or perform operations on individual socket connections. By utilizing this function, developers gain insight into the current state of active connections and can implement customized logic or management strategies tailored to specific socket instances within their real-time communication environment.

```ts
const sockets = chronoSocket.getSockets();
```

### Get individual socket

The function `getSocket` in `ChronoSocketHub` allows developers to retrieve an individual socket connection based on a unique identifier, such as the `clientId`. This function provides a means to access a specific socket instance from the collection of active connections maintained by `ChronoSocketHub`. By specifying the `clientId` as an argument, developers can pinpoint and interact with a particular socket, enabling targeted communication, management, or customization of behaviors for that specific connection within their real-time communication infrastructure.

```ts
chronoSocket.onMessage((client, payload) => {
  // get access to the socket sending the message
  const socket = chronoSocket.getSocket(client);
});
```

## Job Scheduling and Execution

`ChronoSocketHub` seamlessly integrates job scheduling capabilities, allowing developers to orchestrate and manage time-sensitive tasks within their applications. Leveraging either Agenda or BullMQ as the underlying agents, `ChronoSocketHub` empowers developers to schedule, execute, and handle recurring or one-time jobs efficiently. This functionality enables the creation of automated tasks, periodic operations, and background processes, offering a robust solution for managing complex job scheduling requirements within the application ecosystem.

### Schedling a cron task

The `scheduleTask` method in `ChronoSocketHub` facilitates the scheduling of tasks using cron syntax, Date or plain English ("20 seconds", "in 5 minutes"), providing developers with precise control over when and how tasks are executed within their applications. This method allows users to define a unique identifier for the task, specify the desired chronology (one-time or interval-based), and pass a callback function or event handler to be triggered when the scheduled time elapses.

To utilize this feature, developers can invoke the `scheduleTask` method, providing:

- A distinctive name or identifier for the task.
- When you want to execute the task using cron syntax, Date or plain English ("20 seconds", "in 5 minutes").
- The desired chronology: either a one-time execution (schedule) or an interval-based recurrence (interval).
- A callback function or an event handler to be triggered when the scheduled time is reached.

This functionality empowers developers to orchestrate automated actions, periodic tasks, or event-driven processes within their application, offering a flexible and efficient solution for managing scheduled tasks using a familiar cron-based syntax.

### Using Agenda as an agent

```ts
// instantiate ChronoSocketHub
const chrono = new ChronoSocket({ agent: 'agenda', db: 'mongodb://localhost:27017/test-chrono-agendas' });

// call a restful API every 20 seconds
const task = await chrono.scheduleTask(
  "task-name",
  "20 seconds",
  "interval"
  async () => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
);

// notify me at 09:00AM
await chrono.scheduleTask(
    "notify-me",
    "2023-12-06T09:00:00.756Z",
    "schedule",
    async () => {
      await admin.messaging().sendToDevice(tokens, payload);
    }
);

// Back-up database every midnight
await chrono.scheduleTask(
    "backup-database",
    "0 0 * * *",
    "interval",
    async () => {
      await DataHub.backup({ debug: false });
    }
);
```

### Using BullMQ as an agent

```ts
// instantiate ChronoSocketHub
const chrono = new ChronoSocket({
  agent: "bullmq",
  db: "localhost:6379",
  redisPassword: "password",
  allowBullMQRejuvenation: true,
});

await chrono.scheduleTask(
  "task-name",
  { when: "30 seconds", repeatInterval: { pattern: "*/30 * * * * *" } },
  "interval",
  async (job: Job) => {
    console.log(job.data);
  },
  { name: "John Doe" }
);
```

When employing BullMQ as the agent in the `scheduleTask` function, the scheduling mechanism differs from that of Agenda. `ChronoSocketHub` utilizes the `RedisConcurrency` interface to define scheduling options for tasks. This interface offers enhanced flexibility by accepting a `when` property, which can be either a string or a Date object, indicating the time when the task should be scheduled. Additionally, the `repeatInterval` property, if provided as a part of the `RedisConcurrency` interface, allows for specifying options for repeated execution of the task, providing advanced configuration for recurring tasks within the BullMQ scheduler. Leveraging this interface grants users fine-grained control over task scheduling, enabling the precise definition of both single and repeated task execution times within the BullMQ-based scheduling environment.

**Note**: When utilizing the `schedule` type of chronology with `ChronoSocketHub`'s `RedisConcurrency` interface in the `scheduleTask` function, the `repeatInterval` property becomes optional. For single, one-time scheduling (`type: 'schedule'`), the `repeatInterval` property is not mandatory and can be omitted from the scheduling options. This distinction allows users to define singular, non-recurring task executions without the need to specify a repeat interval when using BullMQ's scheduling mechanism.

> **Important Note for Agenda Agent Usage in ChronoSocketHub:**
>
> When integrating Agenda as an agent in `ChronoSocketHub`, please note that manual setup for job rejuvenation is required. Ensure to configure the rejuvenation process for jobs within the Agenda agent to maintain smooth operation and scheduling.
>
> **Note**: While our system supports rejuvenation (recovery of scheduled jobs) when BullMQ is the triggered agent, it's essential to acknowledge that this feature is currently in beta. As a result, there is no guarantee of flawless functionality or consistent job recovery after a server restart. At present, there are no immediate plans to transition this feature to a stable phase. Therefore, caution is advised when relying solely on this functionality for resuming scheduled jobs after a server restart in production environments.
>
> Additionally, users seeking to access a comprehensive list of all jobs within the BullMQ or Agenda scheduler can refer to the appropriate methods provided by `ChronoSocketHub`. This method allows you to retrieve and manage the entirety of scheduled jobs within your BullMQ or Agenda setup:
>
> ```typescript
> const jobs = await chrono.getJobs({ agent: "agenda" });
> ```
>
> <br />

## Configurations:

| Option                    | Description                                                                                            | Default Value     | Data Type              |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------- | ---------------------- |
| `agent`                   | Defines the job scheduling agent for `ChronoSocketHub` (`agenda` or `bullmq`).                         | `agenda`          | `"agenda" \| "bullmq"` |
| `db`                      | Specifies the database for Agenda or BullMQ.                                                           | `undefined`       | `string`               |
| `redisPassword`           | Specifies the password for your redis connection.                                                      | `undefined`       | `string`               |
| `allowBullMQRejuvenation` | Specifies whether you want to rejuvenate jobs on server restart.                                       | `false`           | `boolean`              |
| `socketPath`              | Specifies the path for the socket connection.                                                          | `/`               | `string`               |
| `origin`                  | Sets the allowed origins for CORS (Cross-Origin Resource Sharing).                                     | `*`               | `string`               |
| `methods`                 | Defines the allowed HTTP methods for CORS.                                                             | `['GET', 'POST']` | `string[]`             |
| `logging`                 | Indicates whether logging is enabled.                                                                  | `true`            | `boolean`              |
| `app`                     | Express application instance for integration.                                                          | `undefined`       | `Express`              |
| `volatile`                | Optimizes event transmission for scenarios where sending an event depends on client connection status. | `false`           | `boolean`              |

This table summarizes each configuration option available in `ChronoSocketHub`, providing insight into their descriptions, default values, and respective data types. Developers can adjust these settings according to their application requirements.
