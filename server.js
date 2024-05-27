import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const PORT = 8080;
const app = express();
const options = {
  cors: {
    origin: ["http://localhost:8080"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  }
  
};

const server = app.listen(PORT, () => {
  console.log("server is started");
});

const io = new Server(server, options);

// Use cors middleware
app.use(cors(options));

app.use(express.static("./dist"));

app.options("*", (req, res) => {
  res.set("Access-Control-Allow-Private-Network", "true");
  res.sendStatus(204);
});

app.get("/", (req, res) => {
  res.set("Access-Control-Allow-Private-Network", "true");
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
