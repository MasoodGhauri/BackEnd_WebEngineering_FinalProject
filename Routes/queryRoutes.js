const express = require("express");
const router = express.Router();

const questionRouter = require('../Controllers/queryController/postQuestions'); //PostQuestions
router.post('/api/questions', questionRouter);  

const queryRouter = require('../Controllers/queryController/getAllQueries'); //getAllQueriesRouter
router.get('/api/getAllQueries', queryRouter); 

const searchAnswers = require('../Controllers/queryController/searchAnswer'); //PostQuestions
router.post('/api/searchAnswer', searchAnswers); 
/**/
modules.exports=router;
