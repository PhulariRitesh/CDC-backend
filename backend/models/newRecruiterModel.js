const mongoose = require("mongoose");
const {isEmail} = require("validator");
const {phoneValidator, phoneAltValidator, isEmailAlt} = require("../misc/validators");


const newRecruiterSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        
    },
    about: {
        type: String
    },
    sector: {
        type: String,
        
    },
    category: {
        type: String,
        enum: ["Private Limited","Public Limited", "Government"],
        default: "Private Limited"
    },
    pocEmail: {
        type: String,
        lowercase: true,
        required: true, 
        unique: true,
        trim: true,
        validate:[isEmail, "Email is not valid"]

    },
    pocAltEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate:[isEmailAlt, "Email is not valid"]
    },
    pocPhone: {
        type: String,
        required: true,
        unique: true,
        trim: true
        // validate: [phoneValidator, "The provided Indian phone number is invalid"]
    },

    pocAltPhone: {
        type: String,
        trim: true
        // validate: [phoneAltValidator, "The provided Indian phone number is invalid"]
    },

    pocName: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Rejected", "Approved"],
        default: "Pending"
    }

    
}, {timestamps: true})

const NewRecruiter = mongoose.model("NewRecruiter", newRecruiterSchema)
module.exports = NewRecruiter;