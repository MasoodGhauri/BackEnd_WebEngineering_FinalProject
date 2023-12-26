const express = require("express");
helmet = require("helmet");
cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const upload = require("express-fileupload");
require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://i211198:i211198@cluster0.sgdee5s.mongodb.net/AskPro?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const queryRoutes = require("./Routes/queryRoutes");
const meetingRoutes = require("./Routes/meetingRoutes");

const { verifyTokenExiry } = require("./utils/Authenticate");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use("/static", express.static("uploads"));

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/query", queryRoutes);
app.use("/api/meeting", meetingRoutes);

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});

app.get("/verify", verifyTokenExiry);
