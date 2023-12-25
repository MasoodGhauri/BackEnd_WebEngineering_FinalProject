const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
  },
  expertise: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
