const socket = io("http://localhost:8000", {
  path: "/ws/chat",
});

const room = "room-1";

const form = document.getElementById("form");
const message = document.getElementById("message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (message.value.trim()) {
    socket.emit("message", { message: message.value, room });
    message.value = "";
  }
});

socket.emit("message", { message: "Hey buddy!", room });

(() => {
  socket.emit("subscribe", room);

  socket.on("message", (message) => {
    console.log("FROM SERVER:", message);
  });
})();
