const mongoose = require("mongoose");
const {isEmail} = require("validator");
const {phoneValidator, phoneAltValidator, isEmailAlt} = require("../misc/validators");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        // validate: [phoneValidator, "Invalid Phone number"],
        required: true,
        unique: true,
        trim: true
    },
    altPhone: {
        type: String,
        trim: true
        // validate: [phoneAltValidator, "Invalid Phone number"],
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
        validate: [isEmail, "Invalid Email"]
    },

    altEmail: {
        type: String,
        lowercase: true,
        trim: true,
        validate: [isEmailAlt, "Invalid Email"]
    },
    
    role: {
        type: String,
        required: true,
        enum: ["recruiter", "student", "coordinator", "admin"],
        default: "student"
    },
    recruiter:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recruiter"
    },
    coordinator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coordinator"
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
}, {timestamps: true})

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;


