const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const QuerySchema = new Schema({
    studentId: {
        type: ObjectId,
        ref: 'Student',
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    imageUpload: {
        type: String,
        trim: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    isAnswered: {
        type: Boolean,
        default: false
    },
    answerId: {
        type: ObjectId,
        ref: 'Answer'
    }
});


const Query = mongoose.model('Query', QuerySchema);


module.exports = {Query};
