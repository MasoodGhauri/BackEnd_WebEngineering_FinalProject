const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema(
  {
    code: String,
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", MeetingSchema);

module.exports = { Meeting };
