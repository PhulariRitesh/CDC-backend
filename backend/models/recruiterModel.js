const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const recruiterSchema = new mongoose.Schema({
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    userid: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        lowercase: true,
        trim: true
    },
    about: {
        type: String,
    },
    sector: {
        type: String,
    },
    category: {
        type: String,
        enum: ["Private Limited","Public Limited", "Government"],
        default: "Private Limited"
    },
    
    jobs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Job'}],

    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact"
    },
    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coordinator"
    }

}, {timestamps: true})
recruiterSchema.methods.matchPassword = async function (enteredPassword) {
    console.log(enteredPassword, this.password);
    return await bcrypt.compare(enteredPassword, this.password);
  };

recruiterSchema.pre('save', async function (next) {
    // Only run this function if password was moddified (not on other update functions)
    if (!this.isModified('password')) return next();
    
    // Hash password with strength of 10
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    
});

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

module.exports = Recruiter;