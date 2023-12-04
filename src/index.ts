import { io } from "socket.io-client";
import ChronoSocket from "./core/ChronoSocket";
import { log } from "@drantaz/f-log";

const chronoSocket = new ChronoSocket({
  logging: false,
  socketPath: "/ws/chat",
});

const { server } = chronoSocket;

server.listen(8080, () => {
  log("Server listening on port: 8080", "debug", false);
});
