const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnswerFeedbackSchema = new Schema({
    queryId: {
        type: ObjectId,
        ref: 'Query',
        //required: true
    },
    studentId: {
        type: ObjectId,
        ref: 'Student',
       // required: true
    },
    feedbackText: {
        type: String,
     //   required: true
    },
    points: {
        type: Number,
       // required: true
    }
},{timestamps:true});



const AnswerFeedback = mongoose.model('AnswerFeedback', AnswerFeedbackSchema);

module.exports = {AnswerFeedback};
