const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routes
// const videosessionRoute = require("./Routes/Masood/VideoSession");

const app = express();
app.use(express.json());
require("dotenv").config();

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
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

// app.use("/api/videosession", videosessionRoute);

let socketsList = {};
io.on("connection", (socket) => {
  console.log("a user connected: " + socket.id);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("user disconnected");
  });

  // check if the user is not already present in the room
  socket.on("b-check user", ({ roomId, userName }) => {
    console.log("checking user presence... name " + userName);

    io.sockets
      .in(roomId)
      .allSockets()
      .then((users) => {
        const isUserPresent = Array.from(users).some((clientSocketId) => {
          return (
            socketsList[clientSocketId] &&
            socketsList[clientSocketId].userName === userName
          );
        });

        if (isUserPresent) {
          socket.emit("f-user present");
          console.log("user already present in this room");
        } else {
          socket.emit("f-user not present");
          console.log("user not present in any room");
        }
      })
      .catch((error) => {
        console.error("Error checking user presence:", error);
        socket.emit("f-error checking user presence");
      });
  });

  // add user to the room as he is already not present
  socket.on("b-user join", ({ roomId, userName }) => {
    socket.join(roomId);
    socketsList[socket.id] = { userName, video: true, audio: true };

    io.sockets
      .in(roomId)
      .allSockets()
      .then((roomClients) => {
        try {
          const allUsers = [];
          Array.from(roomClients).forEach((clientSocketId) => {
            allUsers.push({
              userId: clientSocketId,
              info: socketsList[clientSocketId],
            });
          });

          socket.emit("f-users joined", allUsers);
        } catch (e) {
          console.error("Error joining room", e);
          socket.emit("f-error joining room");
        }
      })
      .catch((error) => {
        console.error("Error getting room clients", error);
        socket.emit("f-error joining room");
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

http.listen(3001, () => {
  console.log("Server is running on port 3001");
});

// // Handle shutdown gracefully
// process.on("SIGINT", () => {
//   console.log("Shutting down server");
//   app.server.close();
//   process.exit();
// });
