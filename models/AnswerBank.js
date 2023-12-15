const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnswerSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    expertId: {
        type: ObjectId,
        ref: 'Expert',
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
});


const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = { Answer};
