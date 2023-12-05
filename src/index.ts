import ChronoSocket from "./core/ChronoSocket";
import { log } from "@drantaz/f-log";

const chronoSocket = new ChronoSocket({
  logging: true,
  socketPath: "/ws/chat",
  agent: "agenda",
  db: "mongodb://localhost:27017/test-chrono-agendas?retryWrites=true&w=majority",
});

const { server } = chronoSocket;

server.listen(8080, () => {
  log("Server listening on port: 8080", "debug", false);

  const test2 = () => {
    console.log("Hello world!!!");
  };

  eval(`(${test2.toString()})()`);
});
