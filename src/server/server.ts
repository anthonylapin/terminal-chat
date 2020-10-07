import http from "http";
import socketIO from "socket.io";
import config from "config";
import DbWorker from "./DbWorker";

const PORT: string = process.env.PORT || config.get("PORT");

const server = http.createServer();
const io = socketIO(server);
const db = new DbWorker();

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("get history", db.data);

  socket.on("message", ({ msg, username }) => {
    const message = msg.split("\n")[0];
    db.write({ username, message });
    socket.broadcast.emit("message", { msg: message, username });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected!");
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
