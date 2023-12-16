// const express = require("express");
// const app = express();
// const http = require("http").createServer(app);
// const io = require("socket.io")(http);
const http = require("http").createServer();
// const io = require("socket.io")(http);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// array of all users
let socketsList = {};

const ioFunction = () => {
  io.on("connection", (socket) => {
    console.log("a user connected: " + socket.id);

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log("user disconnected");
    });

    // check if the user is not already present in the room
    socket.on("b-check user", ({ roomId, userName }) => {
      console.log("checking user presence...");
      io.sockets.in(roomId).clients((error, users) => {
        users.forEach((u) => {
          if (socketsList[u] === userName) {
            socket.emit("f-user present");
            return;
          }
        });
        socket.emit("f-user not present");
      });
    });

    // add user to the room as he is already not present
    socket.on("b-user join", ({ roomId, userName }) => {
      socket.join(roomId);
      socketsList[socket.id] = { userName, video: true, audio: true };

      // send the list of all the users already present in the room
      io.sockets.in(roomId).clients((error, users) => {
        try {
          const users = [];
          users.forEach((u) => {
            users.push({ userId: u, info: socketList[u] });
          });
          socket.emit("f-users joined", users);
        } catch (e) {
          console.log("error joinig room", users);
          socket.emit("f-error joining room");
        }
      });
    });

    // when someone want to connect
    socket.on("b-request connect", ({ userToConnect, from, signal }) => {
      io.to(userToConnect).emit("f-get request", {
        signal,
        from,
        info: socketsList[socket.id], // sending info (audio && video) of user who want to connect
      });
    });

    // connection request accepted
    socket.on("b-accept connect", ({ signal, to }) => {
      io.to(to).emit("f-accepted connect", {
        signal,
        answerId: socket.id,
      });
    });
  });
};

module.exports = { ioFunction, http, io };
