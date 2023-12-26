const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuerySchema = new Schema(
  {
    // for student
    catagory: String,
    queryPoster: {
      id: String,
      name: String,
    },
    questionText: String,
    questionJSX: String,
    filesUpload: [
      {
        fileName: String,
        pathName: String,
      },
    ],
    isAnswered: {
      answered: {
        type: Boolean,
        default: false,
      },
      answeredBy: {
        id: String,
        name: String,
      },
    },
    isTaken: {
      taken: {
        type: Boolean,
        default: false,
      },
      takenBy: {
        id: String,
        name: String,
      },
    },
    // for expert
    isSolved: {
      type: Boolean,
      default: false,
    },
    querySolver: {
      id: String,
      name: String,
    },
    answerText: String,
    answerJSX: String,
    answerFiles: [
      {
        fileName: String,
        pathName: String,
      },
    ],
    answerFeedback: {
      type: Number,
      default: -1,
    },
    comments: [
      {
        flag: Boolean,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

const Query = mongoose.model("Query", QuerySchema);

module.exports = { Query };
