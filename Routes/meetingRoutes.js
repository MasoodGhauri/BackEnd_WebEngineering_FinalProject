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

// get meeting auth
router.get("/check/:code", (req, res) => {
  let { code } = req.params;

  Meeting.findOne({ code })
    .then((meeting) => {
      if (meeting) {
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        const currentTime = new Date();
        const meetingTime = new Date(meeting._doc.createdAt);

        if (currentTime - meetingTime < oneDayInMilliseconds) {
          res.status(200).send({
            Success: true,
            Message: "Meeting found",
          });
        } else {
          Meeting.deleteOne({ code: roomID })
            .then(() => console.log("Meeting deleted"))
            .catch((err) => console.log(err));
          res.status(200).send({
            Success: false,
            Message: "Meeting expired",
          });
        }
      } else {
        res.status(404).send({
          Success: false,
          Message: "Meeting not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        Success: false,
        Message: "Internal Server Error",
        Error: err,
      });
    });
});

module.exports = router;
