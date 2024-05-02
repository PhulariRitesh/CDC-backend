const mongoose = require("mongoose");


const eligibilitySchema = new mongoose.Schema({
   job: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Job",
    required: true
   },
   programs: [{type:String, enum: ["MTech", "BTech", "PhD"], default:"BTech"}],
   branches: [{type:String, enum: ["CSE", "MnC","ME","EE"]}],
   cpi: {
    type:Number,
    default:0
   },
   backlogsAllowed: {
    type: Boolean,
    default: false
   },
   numBacklogsAllowed: {
    type:Number,
    default: 0
   },
   previousGraduates: {
    type: Boolean,
    default: false
   },
   additionalCriteria: {
    type:String
   }



}, {timestamps: true})

const Eligibility = mongoose.model("Eligibility", eligibilitySchema);

module.exports = Eligibility;
