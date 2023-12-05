import axios from "axios";
import ChronoSocket from "./core/ChronoSocket";
import { log } from "@drantaz/f-log";

const chrono = new ChronoSocket({
  logging: true,
  socketPath: "/ws/chat",
  agent: "agenda",
  db: "mongodb://localhost:27017/test-chrono-agendas?retryWrites=true&w=majority",
});

const { server } = chrono;

server.listen(8080, async () => {
  log("Server listening on port: 8080", "debug", false);
  await chrono.scheduleTask("task-name", "20 seconds", "schedule", async () => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  });
});
