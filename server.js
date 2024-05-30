import express from "express";
import { Server } from "socket.io";

const PORT = 8080;
const app = express();

const server = app.listen(PORT, () => {
  console.log("server is started on port", PORT);
});

const cors = require('cors');

const io = new Server(server, options);
const options = {
  origin: [
    "https://chat-app-new-m2ui.onrender.com",
    "https://nomishka.github.io/chat_app_new",
  ],
  methods: ["GET", "POST"],
  credentials: true,
};

app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "interest-cohort=()");
});

app.use(cors(options));

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
