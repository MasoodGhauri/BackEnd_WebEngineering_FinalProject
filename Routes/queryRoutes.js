const express = require("express");
const router = express.Router();

const queryRouter = require("../Controllers/queryController"); //PostQuestions

router.post("/new", queryRouter.postQuestion);
router.put("/put", queryRouter.updateQuery);
router.delete("/del/:id", queryRouter.deleteQuery);
router.get("/get/:id", queryRouter.getQuery);
router.get("/getAll", queryRouter.getAllQueries);
router.post("/comment", queryRouter.addComment);
router.post("/feedback", queryRouter.addFeedback);
router.put("/select", queryRouter.selectQuery);
router.post("/answer", queryRouter.answerQuery);
router.put("/answer", queryRouter.updateAnswer);

module.exports = router;
