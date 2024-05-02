const mongoose = require("mongoose");
const {isEmail} = require("validator");
const {sendResetPasswordLink} = require("../auth/emailAuth");

// const phoneValidator = (phone) => {
//     return /^[6-9]\d{9}$/.test(phone);
// }

const passwordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, expires: 360, default: Date.now},
    role: {
        type: String,
        required: true,
        enum: ["student", "coordinator", "recruiter", "admin"],
        default:"recruiter"
    },
    password: {
        type: String,
        required: true
    },

    key: {
        type: String,
        required: true,
        unique: true
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

});

passwordSchema.methods.sendLink = async function (email,name, endpoint) {

    sendResetPasswordLink(email,name, process.env.SERVER_ADDRESS + endpoint);

};

// recruiterSchema.pre('save', async function (next) {
//     // Only run this function if password was moddified (not on other update functions)
//     if (!this.isModified('password')) return next();
    
//     // Hash password with strength of 10
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt);
    
// });

const Password = mongoose.model("Password", passwordSchema);
module.exports = Password;