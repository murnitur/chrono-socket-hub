import http from "http";
import { Server, Socket } from "socket.io";
import { ChronoSocketConfig } from "../types";
import { log } from "@drantaz/f-log";

const allowedLogCases = [true, false];

class ChronoSocket {
  /** generic node http server */
  server: http.Server;
  /** configuration setting */
  private config: ChronoSocketConfig = {};
  /** Socket IO connection */
  private io: Server;
  /** Socket connection */
  private sockets: Map<string, Socket>;

  constructor(config?: ChronoSocketConfig) {
    this.config.db = config?.db || undefined;
    this.config.socketPath = config?.socketPath || "/";
    this.config.origin = config?.origin || "*";
    this.config.methods = config?.methods || ["GET", "POST"];
    this.config.agent = config?.agent || "agenda";
    this.config.logging = allowedLogCases.includes(config?.logging)
      ? config.logging
      : true;
    this.config.volatile = config.volatile || false;
    this.config.app = config?.app || undefined;
    this.server = http.createServer(this.config.app);
    this.sockets = new Map();
    this.io = new Server(this.server, {
      path: this.config.socketPath,
      cors: {
        origin: this.config.origin,
        methods: this.config.methods,
      },
    });
    this.init();
  }

  /**
   * Initializes the configuration for socket connection.
   * This also creates a job connection to any specified agent if @db is passed on ChronoSocket object initialization.
   */
  private init = () => {
    this.io.on("connection", (socket: Socket) => {
      const clientId = socket.id;
      this.sockets.set(clientId, socket);
      this.config.logging &&
        log(`New connection from ${socket.id} established!!!`);

      socket.on("disconnect", () => {
        this.handleDisconnection(clientId);
      });
    });
  };

  private handleDisconnection = (clientId: string) => {
    this.sockets.delete(clientId);
  };

  /**
   * Listens for subscription to a room
   * @cb callback function
   */
  onSubscribe = (
    callback: (clientId: string, room: string | string[]) => void
  ) => {
    this.io.on("connection", (socket: Socket) => {
      socket.on("subscribe", (subscription: string | string[]) => {
        const clientId = socket.id;
        this.config.volatile
          ? socket.volatile.join(subscription)
          : socket.join(subscription);
        callback(clientId, subscription);
      });
    });
    return this;
  };

  /**
   * Listens for un-subscription to a room or rooms
   * @cb callback function
   */
  onUnSubscribe = (
    callback: (clientId: string, room: string | string[]) => void
  ) => {
    this.io.on("connection", (socket: Socket) => {
      socket.on("un-subscribe", (subscription: string | string[]) => {
        const subscriptions = Array.isArray(subscription)
          ? subscription
          : [subscription];

        for (const sub of subscriptions) {
          this.config.volatile ? socket.volatile.leave(sub) : socket.leave(sub);
        }

        const clientId = socket.id;
        callback(clientId, subscription);
      });
    });
    return this;
  };

  /**
   * Listen to custom events
   * @eventName Name of the event
   * @listener callback function
   */
  on = (
    eventName: string,
    callback: (clientId: string, ...args: any[]) => void
  ) => {
    this.io.on("connection", (socket: Socket) => {
      socket.on(eventName, (...args: any[]) => {
        callback(socket.id, ...args);
      });
    });
    return this;
  };

  /**
   * Removes the specified listener from the listener array for the event eventName.
   * @eventName Name of the event
   * @listener callback function
   */
  removeListener = (
    eventName: string,
    callback: (clientId: string, ...args: any[]) => void
  ) => {
    this.io.on("connection", (socket: Socket) => {
      socket.removeListener(eventName, (...args: any[]) => {
        callback(socket.id, ...args);
      });
    });
    return this;
  };

  /**
   * Removes all listeners, or those of the specified eventName.
   * @eventName Name of the event
   */
  removeAllListener = (eventName: string | symbol) => {
    this.io.on("connection", (socket: Socket) => {
      socket.removeAllListeners(eventName);
    });
    return this;
  };

  /**
   * Sends a message to a room or broadcast
   * @clientId needed to identify the client socket to receive the message
   * @room room to send message to
   * @eventName name of event to trigger message
   * @payload message to send
   * @broadcast If true, the message will be broadcast to everyone in the room except the sender of the message. Defaults to true
   */
  sendMessage = (
    clientId: string,
    eventName: string,
    payload: any,
    broadcast: boolean = true,
    room?: string | string[]
  ) => {
    const socket = this.sockets.get(clientId);
    if (socket) {
      if (!broadcast && !room) {
        log("Please specify a room for a non-broadcast message", "error");
        return;
      }

      if (this.config.volatile) {
        if (broadcast) {
          if (room) {
            this.io.volatile.to(room).emit(eventName, payload);
          } else {
            this.io.volatile.emit(eventName, payload);
          }
        } else {
          socket.volatile.to(room).emit(eventName, payload);
        }
      } else {
        if (broadcast) {
          if (room) {
            this.io.to(room).emit(eventName, payload);
          } else {
            this.io.emit(eventName, payload);
          }
        } else {
          socket.to(room).emit(eventName, payload);
        }
      }
    } else {
      log(`Socket for client ${clientId} not found.`, "error");
    }
  };

  /**
   * Listens to messages from client
   * @cb callback function
   */
  onMessage = (callback: (clientId: string, ...args: any[]) => void) => {
    this.io.on("connection", (socket: Socket) => {
      socket.on("message", (...args: any[]) => {
        const clientId = socket.id;
        callback(clientId, ...args);
      });
    });
    return this;
  };

  getSockets = () => {
    return this.sockets;
  };

  getSocket = (clientId: string) => {
    return this.sockets.get(clientId);
  };
}

export default ChronoSocket;
