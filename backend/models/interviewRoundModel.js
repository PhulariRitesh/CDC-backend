const mongoose = require("mongoose");
const {isURL} = require("validator");


const interviewRoundSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Job"
    },

    number: {
        type: Number,
        default:0
    },

    name: {
        type: String,
        trim: true
    },

    roundType:{
        type: String,
        required: true,
        enum: ["Written Test", "Interview", "Group Discussion"]

    },
    type: {
        type: String,
        enum: ["Technical", "Aptitude", "Case Study","HR", "Others"]
    },

    description: {
        type: String,
        trim: true
    },

    
    slot1: {
        type: Date,
        // required: true
    },
    slot2: {
        type:Date
    },
    slot3: {
        type: Date
    },
    file : {
        type:String
        // Excel file link for shortlisted candidates
    },
    link : {
        type: String,
        validate: [isURL, "The provided link is not valid"]
    },
    shortlisted: [{type: mongoose.Schema.Types.ObjectId, ref:"Student"}],
    result: [{type: mongoose.Schema.Types.ObjectId, ref:"Student"}]

})

const InterviewRound = mongoose.model("InterviewRound", interviewRoundSchema)
module.exports = InterviewRound;