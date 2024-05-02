const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    role: {
        type: String,
        // required: true
    },
    designation: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    location : {
        type: String,
        // required: true
    },
    bond : {
        type: Boolean,
        default: false
    },
    bondType: {
        type :String
    },
    joiningDate: {
        type: Date
    },
    expectedHires: {
        type: Number,
        default: -1
    },
    workingWeekDays: {
        type: Number,
        default: -1
    },
    applicationDeadline: {
        type: Date
    },
    eligibility: {
        type: mongoose.Schema.Types.ObjectId, ref: "Eligibility"
    },
    ppt: {
        type: Boolean,
        // required: true
    },
    pptDate: {
        type: Date
    },
    resumeShortlisting: {
        type: Boolean,
        // required: true
    },
    resumeShortlistingDate: {
        type: Date
    },
    
    groupDiscussion: {
        type: Boolean,
        // required: true
    },
    writtenTest: {
        type: Boolean,
        // required: true
    },
    testType: {
        type: String,
        enum: ["Technical", "Aptitude", "Case Study", "Others"]
    },
    testDescription: {
        type: String
    },

    interview: {
        type: Boolean,
        // required: true
    },
    expectedRounds: {
        type: Number,
        default: -1
    },
    interviewType: {
        type: String,
        enum: ["Technical", "Aptitude", "HR", "Others"]
    },
    interviewDescription: {
        type: String
    },

    package: [{
        program: {
            type: String, enum: ["PhD", "MTech", "BTech"],
            default: "BTech"
        },
        ctc: Number,
        description: String

    }],

    finalised: {
        type: Boolean,
        default: false
    },

    rounds : [{type:mongoose.Schema.Types.ObjectId, ref:"InterviewRound"}],
    appliedStudents: [{type:mongoose.Schema.Types.ObjectId, ref:"Student"}],
    selectedStudents: [{type:mongoose.Schema.Types.ObjectId, ref:"Student"}],
}, {timestamps: true})

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;