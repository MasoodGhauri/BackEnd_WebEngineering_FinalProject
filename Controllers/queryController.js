const { Query } =require("../models/QueryPosting")
const express = require('express');
const router = express.Router();
const multer = require('multer');
//const { Query } = require('../models/query');
//const { Answer } = require('../models/answer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//const postQuestion=upload.single('imageUpload');
 //router.post("/postQuestions", postQuestion, async (req, res) => {
 const postQuestion =  async (req, res) => {
    try {                                                   
        const { studentId, questionText } = req.body;                           // Route to allow students to post questions
        let imageUpload = '';

        if (req.file) {
            console.log("Hello");
            imageUpload = req.file.buffer.toString('base64');
        }

        const newQuery = new Query({
            studentId,
            questionText,
            imageUpload
        });

        const savedQuery = await newQuery.save();
        res.status(201).json(savedQuery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
};

const getAllQueries =  async (req, res) => {          // Route to retrieve all queries
    try {
        const queries = await Query.find().populate('studentId').exec();
        res.status(200).json(queries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//Answer schema ||
//              \/

const searchAnswer = async (req, res) => {
    try {
        const { questionText } = req.body;
        const answer = await Answer.findOne({ questionText }).exec();        // Check if the answer is present in the Answer bank

        if (answer) {
            const query = await Query.findOne({ questionText, isAnswered: false }).exec();            // If an answer is found, mark the corresponding query as answered

            if (query) {
                query.isAnswered = true;
                query.answerId = answer._id;
                await query.save();
            }

            res.status(200).json({ answer: answer.answerText });
        } else {
            res.status(404).json({ error: 'Answer not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//Other schema  ||
//              \/

const selectQuery = async (req, res) => {
    try {
        const { expertId, queryId } = req.body;

        // Check if the expert exists
        const expert = await Expert.findById(expertId).exec();
        if (!expert) {
            return res.status(404).json({ error: 'Expert not found' });
        }

        // Check if the query exists and is not already answered
        const query = await Query.findOne({ _id: queryId, isAnswered: false }).exec();
        if (!query) {
            return res.status(404).json({ error: 'Query not found or already answered' });
        }

        // Update the query to mark it as answered and assign it to the expert
        query.isAnswered = true;
        query.answerId = new Answer(); // Assuming Answer model has a default constructor
        await query.save();

        res.status(200).json({ message: 'Query selected for answering' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Route for an expert to save a query for answering later
const saveForLater = async (req, res) => {
    try {
        const { expertId, queryId } = req.body;

        // Check if the expert exists
        const expert = await Expert.findById(expertId).exec();
        if (!expert) {
            return res.status(404).json({ error: 'Expert not found' });
        }

        // Check if the query exists and is not already answered
        const query = await Query.findOne({ _id: queryId, isAnswered: false }).exec();
        if (!query) {
            return res.status(404).json({ error: 'Query not found or already answered' });
        }

        // Save the query for later answering by the expert
        expert.queriesToAnswer.push(queryId);
        await expert.save();

        res.status(200).json({ message: 'Query saved for later answering' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const giveFeedback = async (req, res) => {
    try {
        const { queryId, studentId, feedbackText, rating } = req.body;

        // Check if the query exists and is answered
        const query = await Query.findOne({ _id: queryId, isAnswered: true }).exec();
        if (!query) {
            return res.status(404).json({ error: 'Query not found or not answered yet' });
        }

        // Save the feedback
        const newFeedback = new Feedback({
            queryId,
            studentId,
            feedbackText,
            rating
        });

        const savedFeedback = await newFeedback.save();

        // Update points for the expert based on the feedback rating
        const expert = await Expert.findById(query.expertId).exec();
        if (expert) {
            const pointChange = rating > 3 ? 1 : rating < 3 ? -1 : 0;

            // Update points for the expert
            let expertPoints = await Point.findOne({ expertId: expert._id }).exec();

            if (!expertPoints) {
                expertPoints = new Point({
                    expertId: expert._id,
                    points: pointChange
                });
            } else {
                expertPoints.points += pointChange;
            }

            await expertPoints.save();
        }

        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports={
postQuestion,getAllQueries,searchAnswer,selectQuery,saveForLater,giveFeedback
};
