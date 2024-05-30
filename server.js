import express from "express";
import { Server } from "socket.io";

const PORT = 8080;
const app = express();

const allowedOrigins = [
  "https://chat-app-new-m2ui.onrender.com",
  "https://github.com/Nomishka/chat_app_new"
];

const server = app.listen(PORT, () => {
  console.log("server is started on port", PORT);
});

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
})

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Permissions-Policy", "interest-cohort=()");
  next();
})

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
