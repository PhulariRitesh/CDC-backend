const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");


const coordinatorSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name :{
        type: String,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    }
}, {timestamps: true});

coordinatorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


coordinatorSchema.pre('save', async function (next) {
    // Only run this function if password was moddified (not on other update functions)
    if (!this.isModified('password')) return next();
    
    // Hash password with strength of 10
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    
});

const Coordinator = mongoose.model("Coordinator", coordinatorSchema);

module.exports = Coordinator;