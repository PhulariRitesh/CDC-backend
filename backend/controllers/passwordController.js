const RecruiterModel = require("../models/recruiterModel");
const StudentModel = require("../models/studentModel");
const CoordinatorModel = require("../models/coordinatorModel");
const AdminModel = require("../models/adminModel");
const {sendResetPasswordLink, sendCredentials} = require("../auth/emailAuth");
const jwt = require("jsonwebtoken");
function isPasswordValid(password) {
    // Define a regular expression pattern for the allowed characters.
    const pattern = /^[a-zA-Z0-9!@%&_?]+$/;
  
    // Test if the password matches the pattern.
    return pattern.test(password);
}

const generateToken = (_id) =>{
    return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 360
    });
}
module.exports.resetPasswordGet = async (req, res) => {
    const password = req.body.password;
    const token = req.params.token;
    const role = req.params.role;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error){
        return res.status(401).json({success: false, message: "Invalid Token"});
    }


    return res.render("resetPassword");
}

module.exports.resetPasswordPost = async  (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.params.token;
    const role = req.params.role;

    if (!token || !role){
        return res.status(401).json({success: false, message: "URL data missing"});
    }

    // Not accounting for space in password, should be done in front-end
    if (!password || password.length < 8) {
        return res.status(401).json({success: false, message: "Password can't be empty or less than 8 characters"});
    }
    if (password != confirmPassword){
        return res.status(401).json({success: false, message: "Password doesn't match"});
    }

    if (!isPasswordValid(password)){
        return res.status(401).json({success: false, message: "Password contains invalid characters"});
    }
    // console.log(req.headers.authorization);
    // if (
    //     req.headers.authorization &&
    //     req.headers.authorization.startsWith("Bearer")
    // ) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (role == "recruiter"){
                const Recruiter = await RecruiterModel.findById(decoded._id);
                if (!Recruiter) {
                    return res.status(401).json({success: false, message: "Token expired: Recruiter doesn't exist"});
                }
                Recruiter.password = password;
                Recruiter.save();
                sendCredentials(Recruiter.companyEmail, Recruiter.name, Recruiter.userid, password);
    
                // sendResetPasswordLink(Recruiter.companyEmailemail, Recruiter.name, process.env.SERVER_ADDRESS + `/credentials/resetPassword/recruiter/${token}`);
                
                return res.json({success:true, message:"Password changed succesfully. New credentials sent to registered email"});
    
            } 
            else if (role == "student") {
                const Student = await StudentModel.findOne({email});
                if (!Student) {
                    return res.status(401).json({success: false, message: "The student email doesn't exist"});
                }
                const token = generateToken(Student._id);
    
                sendResetPasswordLink(email, Student.name, process.env.SERVER_ADDRESS + `/credentials/resetPassword/student/${token}`);
                
                return res.json({success:true, message:"Password changed succesfully. New credentials sent to registered email"});
    
            } else if (role == "coordinator") {
                const Coordinator = await CoordinatorModel.findOne({email});
                if (!Coordinator) {
                    return res.status(401).json({success: false, message: "The coordinator email doesn't exist"});
                }
                const token = generateToken(Coordinator._id);
    
                sendResetPasswordLink(email, Coordinator.name, process.env.SERVER_ADDRESS + `/credentials/resetPassword/coordinator/${token}`);
                
                return res.json({success:true, message:"Password changed succesfully. New credentials sent to registered email"});
    
            } else if (role == "admin") {
    
                const Admin = await AdminModel.findOne({email});
                if (!Admin) {
                    return res.status(401).json({success: false, message: "The admin email doesn't exist"});
                }
                const token = generateToken(Admin._id);
    
                sendResetPasswordLink(email, Admin.name, process.env.SERVER_ADDRESS + `/credentials/resetPassword/admin/${token}`);
                
                return res.json({success:true, message:"Password changed succesfully. New credentials sent to registered email"});
    
    
            } else {
                return res.status(401).json({success: false, message: "Invalid role"});
            }
    
            
        } catch (error) {
            console.log(error);
            return res.status(401).json({success: false, message: "Invalid Token"});
        }
    
      
} 
 

module.exports.forgotPassword = async (req, res) => {
    const {email} = req.body;
    const role = req.params.role;
    console.log(role);

    if (!role || !email) {
        return res.status(401).json({success: false, message: "Missing fields"});
    } 


    try {

        if (role == "recruiter"){
            const Recruiter = await RecruiterModel.findOne({companyEmail: email});
            if (!Recruiter) {
                return res.status(401).json({success: false, message: "The recruiter email doesn't exist"});
            }
            const token = generateToken(Recruiter._id);

            sendResetPasswordLink(email, Recruiter.name, process.env.SERVER_ADDRESS + `/credentials/resetPassword/recruiter/${token}`);
            
            return res.json({success:true, message:"Password reset link sent to registered email"});

        } 
        else if (role == "student") {
            const Student = await StudentModel.findOne({email});
            if (!Student) {
                return res.status(401).json({success: false, message: "The student email doesn't exist"});
            }
            const token = generateToken(Student._id);

            sendResetPasswordLink(email, Student.name, process.env.SERVER_ADDRESS + `/credentials/resetPassword/student/${token}`);
            
            return res.json({success:true, message:"Password reset link sent to registered email"});

        } else if (role == "coordinator") {
            const Coordinator = await CoordinatorModel.findOne({email});
            if (!Coordinator) {
                return res.status(401).json({success: false, message: "The coordinator email doesn't exist"});
            }
            const token = generateToken(Coordinator._id);

            sendResetPasswordLink(email, Coordinator.name, process.env.SERVER_ADDRESS + `/credentials/resetPassword/coordinator/${token}`);
            
            return res.json({success:true, message:"Password reset link sent to registered email"});

        } else if (role == "admin") {

            const Admin = await AdminModel.findOne({email});
            if (!Admin) {
                return res.status(401).json({success: false, message: "The admin email doesn't exist"});
            }
            const token = generateToken(Admin._id);

            sendResetPasswordLink(email, Admin.name, process.env.SERVER_ADDRESS + `/credentials/resetPassword/admin/${token}`);
            
            return res.json({success:true, message:"Password reset link sent to registered email"});


        } else {
            return res.status(401).json({success: false, message: "Invalid role"});
        }

        
    } catch (error) {
        console.log(error);
        return res.status(401).json({success: false, message: "Password reset failed"});
    }
}

