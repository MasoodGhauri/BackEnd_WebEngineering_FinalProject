const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnsweringQuerySchema = new Schema({
    expertId: {
        type: ObjectId,
        ref: 'Expert',
        required: true
    },
    queryId: {
        type: ObjectId,
        ref: 'Query',
        required: true
    },
    answerText: {
        type: String,
        required: true
    },
    dateAnswered: {
        type: Date,
        default: Date.now
    }
});


const AnsweringQuery = mongoose.model('AnsweringQuery', AnsweringQuerySchema);

module.exports = {AnsweringQuery};
