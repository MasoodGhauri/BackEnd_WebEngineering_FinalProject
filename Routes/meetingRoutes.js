const express = require("express");
const { Meeting } = require("../models/Meeting");
const router = express.Router();

router.get("/new", (req, res) => {
  const generateRandomId = () => {
    const characters = "abcdefghi2jklmnopqrstuvwxyz89";
    const left = Array.from({ length: 3 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
    const middle = Array.from({ length: 2 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
    const right = Array.from({ length: 4 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
    // return `prt-${randomString.slice(0, 2)}-${randomString.slice(2)}`;
    return `${left}-${middle}-${right}`;
  };
  let meetingCode = generateRandomId();
  try {
  } catch (err) {}
  Meeting.create({ code: meetingCode })
    .then((meeting) => {
      res.status(200).send({
        Success: true,
        Message: "Meeting created",
        Code: meeting._doc,
      });
    })
    .catch((err) => {
      res.status(500).send({
        Success: false,
        Message: "Error creating meeting",
        Error: err,
      });
    });
});

module.exports = router;
