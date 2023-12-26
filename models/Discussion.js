const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const DiscussionSchema = new Schema({
    queryId: {
        type: ObjectId,
        ref: 'Query',
        //required: true
    },
    studentId: {
        type: ObjectId,
        ref: 'Student',
        //required: true
    },
    expertId: {
        type: ObjectId,
        ref: 'Expert',
        //required: true
    },
    commentText: {
        type: String,
       // required: true
    }
},{timestamps:true});

const Discussion = mongoose.model('Discussion', DiscussionSchema);

module.exports = {Discussion };
