const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {isEmail} = require("validator")

const studentSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true,
        unique: true
    },
    name :{
        type: String,
        required: true
    },
    cpi: {
        type: Number,
        default: 0,
        required: true
    },
    branch: {
        type: String,
        enum: ["CSE","ME","EE","MnC"],
        default: "CSE"
    },
    degree: {
        type: String,
        enum: ["BTech","MTech"],
        default: "BTech"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate:[isEmail, "Email is not valid"]
    }
},{timestamps: true})

studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


studentSchema.pre('save', async function (next) {
    // Only run this function if password was moddified (not on other update functions)
    if (!this.isModified('password')) return next();
    
    // Hash password with strength of 10
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;