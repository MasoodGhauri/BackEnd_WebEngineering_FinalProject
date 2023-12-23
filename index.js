require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const socket = require("socket.io");

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// cors settings
app.options("*", cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,Content-Length,X-Requested-With"
  );
  next();
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// used vaiables
const users = {};
const socketsList = {};

io.on("connection", (socket) => {
  socket.on("b-join room", (roomID) => {
    if (users[roomID]) {
      // Check if the current socket is not already in the room
      if (!users[roomID].includes(socket.id)) {
        users[roomID].push(socket.id);
      }
    } else {
      users[roomID] = [socket.id];
    }

    socketsList[socket.id] = roomID;

    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    console.log(usersInThisRoom);
    socket.emit("f-users joined", usersInThisRoom);
  });

  socket.on("b-request connect", ({ userToConnect, from, signal }) => {
    io.to(userToConnect).emit("f-get request", {
      signal: signal,
      from: from,
    });
  });

  socket.on("b-accept connect", ({ from, signal }) => {
    io.to(from).emit("f-accepted connect", {
      signal: signal,
      id: socket.id,
    });
  });

  // disconnect not working properly
  // socket.on("disconnect", () => {
  //   const roomID = socketsList[socket.id];
  //   let room = users[roomID];
  //   if (room) {
  //     room = room.filter((id) => id !== socket.id);
  //     users[roomID] = room;
  //   }
  //   socket.broadcast.emit("user left", socket.id);
  // });

  // socket.on("disconnect", () => {
  //   console.log("left : "+socket.id);
  //   const roomID = socketsList[socket.id];

  //   if (roomID) {
  //     let room = users[roomID];

  //     if (room) {
  //       // Filter out the disconnected socket ID from the room
  //       room = room.filter((id) => id !== socket.id);
  //       users[roomID] = room;

  //       // Notify other users in the room about the disconnection
  //       socket.broadcast.to(roomID).emit("user left", socket.id);
  //     }
  //   }
  // });

  // socket.on("disconnect", () => {
  //   console.log("left: " + socket.id);
  //   const roomID = socketsList[socket.id];

  //   if (roomID) {
  //     let room = users[roomID];

  //     if (room) {
  //       // Filter out the disconnected socket ID from the room
  //       room = room.filter((id) => id !== socket.id);
  //       users[roomID] = room;

  //       // Notify other users in the room about the disconnection
  //       io.to(roomID).emit("user left", socket.id);
  //     }
  //   }
  // });
});

server.listen(3001, () => {
  console.log("Server started at 3001");
});
