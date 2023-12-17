const express = require("express");
const router = express.Router();

const queryRouter = require('../Controllers/queryController'); //PostQuestions
router.post('/api/questions', queryRouter.postQuestion);  

router.get('/api/getAllQueries', queryRouter.getAllQueries); 

router.post('/api/giveFeedback', queryRouter.giveFeedback); 

router.post('/api/saveForLater', queryRouter.saveForLater);

router.post('/api/searchAnswers', queryRouter.searchAnswer); 

router.post('/api/selectQuery', queryRouter.selectQuery); 

/**/
module.exports=router;
