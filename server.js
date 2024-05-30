import express from "express";
import { Server } from "socket.io";

const PORT = 8080;
const app = express();
const options = {
  cors: true,
  origin: ["https://chat-app-new-m2ui.onrender.com"]
};

const server = app.listen(PORT, () => {
  console.log("server is started on port", PORT);
});

const io = new Server(server, options);

app.use(express.static("./docs"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connection", (socket) => {
  socket.emit("welcome", socket.id);
  socket.join("room1");

  socket.on("message", (message) => {
    io.to("room1").emit("receiveMessage", {
      userId: socket.id,
      message: message,
    });
  });
});
