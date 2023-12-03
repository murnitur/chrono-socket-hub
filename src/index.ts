import ChronoSocket from "./core/ChronoSocket";
import { log } from "@drantaz/f-log";

const chronoSocket = new ChronoSocket({
  logging: true,
  socketPath: "/ws/chat",
});
const { server } = chronoSocket;

server.listen(8000, () => {
  log("Server listening on port: 8000", "debug", false);

  chronoSocket.onSubscribe((client, room) => {
    chronoSocket.sendMessage(
      client,
      "message",
      `Hello 👋🏾 ${client}, welcome to room: ${room}`,
      true,
      room
    );
  });

  chronoSocket.onMessage((client, payload) => {
    chronoSocket.sendMessage(client, "message", payload, true, payload.room);
  });
});
