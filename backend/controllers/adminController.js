const NewRecruiterModel = require("../models/newRecruiterModel");
const ContactModel = require("../models/contactModel");
const RecruiterModel = require("../models/recruiterModel");
const AdminModel = require("../models/adminModel");
const StudentModel = require("../models/studentModel");
const CoordinatorModel = require("../models/coordinatorModel");
const {sendCredentials} = require("../auth/emailAuth");
const {generateUserid, generatePass} = require("../misc/cred-gen");
const generateToken = require("../config/generateToken");

const {errorHandler} = require("../middlewares/errorHandler");
const NewRecruiter = require("../models/newRecruiterModel");



module.exports.verifyRecruiter = async (req, res) => {

    // const {username, password} = req.body;

    const recruiterId = req.params.id;
    const coordinatorId = req.body.coordinatorId;

    const userid = generateUserid();
    const password = generatePass();

    // console.log(username, password, req.body);

    if (!userid || !password){
        res.status(400).json({success: false, message:"Provide credentials"});
    } else {
        try {
            const newRecruiter = await NewRecruiterModel.findById(recruiterId);

            if (newRecruiter){
                const {
                    companyName, website, about, category, sector, pocEmail , pocAltEmail, pocPhone, pocAltPhone, pocName
                } = newRecruiter;

                const Coordinator = await CoordinatorModel.findById(coordinatorId);
                
                if (!Coordinator){
                    return res.status(401).json({success: false, message:"Coordinator Not Found"});
                }

                const Contact = await ContactModel.create({
                    name: pocName,
                    phone: pocPhone,
                    email: pocEmail,
                    altPhone: pocAltPhone,
                    altEmail: pocAltEmail,
                    role: "recruiter"
                })

                const Recruiter = await RecruiterModel.create({
                    companyEmail: pocEmail,
                    userid: userid,
                    password: password,
                    name: companyName,
                    contact: Contact._id,
                    website: website,
                    about: about,
                    category: category,
                    sector: sector,
                    coordinator: Coordinator._id
                })

                Contact.recruiter = Recruiter._id;
                Contact.save();
                newRecruiter.status = "Approved";
                newRecruiter.save();

                if (Recruiter){
                    sendCredentials(pocEmail, companyName, userid, password);
                }
        
                res.status(200).json({contact:Contact, recruiter: Recruiter, success: true, message: "Recruiter accepted succesfully"})
            } else {
                res.status(400).json({success: false,message :"Recruiter not found"});
            }
            
        } catch (error){
            console.log(error);
            message = errorHandler(error);
            // res.status(400).json({success: false, message: "Recruiter Acceptance Failed"})
            res.status(400).json({success: false, message})
        }
    }
    
}

module.exports.signup = async (req, res) => {
    const {userid, password, email, name, key} = req.body;
    if (userid && password && email && name && (key == process.env.ADMIN_KEY)) {
        try {
            const admin = await AdminModel.create({userid, password, email, name});

            return res.json({

                success:true, message: "Admin successfully added",_id: admin._id, userid: admin.userid , email:admin.email, name: admin.name, token: generateToken(admin._id)
            })
        } catch (error) {
            // console.log(error);
            message = errorHandler(error);
            // return res.status(401).json({
            //     success:false,
            //     message: "Failed to create new admin"
            // })
            return res.status(401).json({
                success:false,
                message
            })
        }
        
    } else {
        return res.status(401).json({
            success: false,
            message: "Data is missing"
        })
    }
}

module.exports.login = async(req, res) => {
    const {userid, password} = req.body;

    if (!userid || !password) {
        return res.status(201).json({success: false, message: "Invalid username or password"});
    }

    const admin = await AdminModel.findOne({userid});
    if (!admin) {
        return res.status(201).json({success: false, message: "No user found"});
    }
    if (await admin.matchPassword(password)) {
        return res.json({
            success:true, message: "Admin successfully logged in",_id: admin._id, userid: admin.userid , email:admin.email, name: admin.name, token: generateToken(admin._id)
        })
    } else {
        return res.status(201).json({success: false, message: "Userid and password doesn't match"});
    }
}

module.exports.addStudent = async (req, res) => {
    const {rollno, name, cpi, branch, degree, email} = req.body;
    let password = req.body.password;
    if (!password) {
        password = `${rollno}@iitgoa`;
    }
    
    if (!name || !cpi || !branch || !degree || !email){
        return res.status(401).json({message:"Required fields missing", success: false});
    } else {

        try {

            const Student = await StudentModel.create({
                userid: rollno,name,
                rollno, cpi, branch, degree, email, password
            });

            res.json({success: true, message:"Student sucessfully added", Student})

        } catch (error) {
            // console.log("Student Addition Error:",error);
            message = errorHandler(error);
            // return res.status(401).json({success:false, message: "Student addition failed"})
            return res.status(401).json({success:false, message})
        }
    }
}

module.exports.addCoordinator = async (req, res) => {
    const studentId = req.params.id;

    if (!studentId){
        return res.status(401).json({success:false, message: "Fields missing"});
    }

    try {

        const Student = await StudentModel.findById(studentId);
        const {name, email} = Student;
        const userid = Student.rollno;
        const password = `${userid}@iitgoa`;

        const Coordinator = await CoordinatorModel.create({userid, password, name, email, student:Student._id});

        return res.json({success:true, message: "Coordinator Succesfully added", Coordinator});

    }   catch (error) {
        // console.log("Add Coordinator Error:",error);
        message = errorHandler(error);
        // return res.status(401).json({success:false, message: "Add Coordinator failed"});
        return res.status(401).json({success:false, message});
    }
}