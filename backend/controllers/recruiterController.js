const NewRecruiterModel = require("../models/newRecruiterModel");
// const PasswordModel = require("../models/passwordModel");
const RecruiterModel = require("../models/recruiterModel");
const generateToken = require("../config/generateToken");
const JobModel = require("../models/jobModel");
const EligibilityModel = require("../models/eligibilityModel");
const InterviewRoundModel = require("../models/interviewRoundModel");
const { errorHandler } = require("../middlewares/errorHandler");
const { sendResetPasswordLink } = require("../auth/emailAuth");
const { generateLinkID } = require("../misc/cred-gen");


module.exports.postApplication = async (req, res) => {
    const { companyName, website, about, category, sector, pocEmail, pocAltEmail, pocPhone, pocAltPhone, pocName } = req.body;

    if (!companyName || !about || !category || !sector || !pocEmail || !pocPhone || !pocName) {

        return res.status(400).json({ success: false, message: "Required Fields Missing" });

    }
    let checkRecruiter = await NewRecruiterModel.findOne({$or : [{pocPhone},{pocEmail}]});
    if (checkRecruiter){
        if (checkRecruiter.status == "Pending"){
            return res.status(400).json({success:false, message:"The application with this phone number or email already exists and is waiting for approval"});
        } else if (checkRecruiter.status == "Approved"){
            return res.status(400).json({success:false, message:"Application with this phone number or email has been approved. Check your mailbox for login credentials"})
        }
    }

    try {
        const newRecruiter = await NewRecruiterModel.create({
            companyName, website, about, category, sector, pocEmail, pocAltEmail, pocPhone, pocAltPhone, pocName
        })
        res.status(200).json({ success: true, message: "Application submitted successfully", application: newRecruiter });
    } catch (error) {

        // console.log("Error:\n",error);
        message = errorHandler(error)
        // res.status(400).json({success: false, message:"Application submission failed"});
        res.status(400).json({ success: false, message });
    }




}

module.exports.testAuth = (req, res) => {
    console.log("Recruiter accessed confidential info");
    res.status(200).json({ success: true, message: "Confidential Resource access gained", data: req.recruiter });
}

module.exports.addJob = async (req, res) => {

    // Selection Process / Round Model info
    const { applicationDeadline, ppt, pptDate, resumeShortlisting, resumeShortlistingDate, writtenTest, groupDiscussion, interview, expectedRounds } = req.body;

    res.json({ success: true, message: "Adding Job" });
}

// Job Creation

module.exports.createJob = async (req, res) => {
    try {
        const job = await JobModel.create({ recruiter: req.recruiter._id });
        res.json({success:true, job})

    } catch (error) {
        const message = errorHandler(error);
        res.status(401).json({success:false, message});
    }
    


}

module.exports.updateDescription = async (req, res) => {
    const jobid = req.params.id;
    // Job Model Description

    const { role, designation, description, location, bond, joiningDate, expectedHires, workingWeekDays, bondType } = req.body;
    if (!role || !designation || !description || !location) {
        return res.status(401).json({ success: false, message: "Required fields missing" });
    }
    try {
        const job = await JobModel.findById(jobid);

        if (!job) {
            return res.json({ success: false, message: "The job doesn't exist" });
        }
        console.log(job.recruiter, req.recruiter._id);
        if (!(job.recruiter == req.recruiter.id)) {
            return res.json({ success: false, message: "Recruiter not authorised to access this job" });
        }

        const job2 = await JobModel.findByIdAndUpdate(jobid, { role, designation, description, location, bond, joiningDate, expectedHires, workingWeekDays, bondType });

        return res.json({ success: true, message: "Job description updated successfully", job: job2 });

    } catch (error) {
        const message = errorHandler(error);
        return res.status(401).json({ success: false, message });
    }
}

module.exports.updateEligibility = async (req, res) => {
    const jobid = req.params.id;
    

    // Eligibility Model Info
    let branches = req.body.branch;
    const { programs, cpi, backlogsAllowed, numBacklogsAllowed, previousGraduates, additionalCriteria } = req.body;

    if (branches == undefined || branches.length == 0){
        branches = ["CSE", "MnC", "EE", "ME"];
    }

    if (!programs) {
        res.status(401).json({ success: false, message: "Required fields missing" });
    }

    try {
        const job = await JobModel.findById(jobid);

        if (!job) {
            return res.json({ success: false, message: "The job doesn't exist" });
        }

        if (!(job.recruiter == req.recruiter.id)) {
            return res.json({ success: false, message: "Recruiter not authorised to access this job" });
        }
        let eligibility;
        if (!(job.eligibility)){

            eligibility = await EligibilityModel.create({ job: job._id, programs, branches, cpi, backlogsAllowed, numBacklogsAllowed, previousGraduates, additionalCriteria });

            job.eligibility = eligibility._id;
            job.save();

        } else {
            eligibility = await EligibilityModel.findById(job.eligibility);
            eligibility.programs = programs;
            eligibility.branches = branches;
            eligibility.cpi = cpi;
            eligibility.backlogsAllowed = backlogsAllowed;
            eligibility.numBacklogsAllowed = numBacklogsAllowed;
            eligibility.previousGraduates = previousGraduates;
            eligibility.additionalCriteria = additionalCriteria;

            eligibility.save();
        }

        

        return res.json({ success: true, message: "Job eligibility updated successfully", job, eligibility });

    } catch (error) {
        const message = errorHandler(error);
        return res.status(401).json({ success: false, message });
    }

}

module.exports.updatePackage = async (req, res) => {
    const jobid = req.params.id;

    // Package Details
    const { package } = req.body;

    if (!package) {
        return res.status(401).json({ success: false, message: "Data missing" });
    }

    try {
        const job = await JobModel.findById(jobid);

        if (!job) {
            return res.json({ success: false, message: "The job doesn't exist" });
        }

        if (!(job.recruiter == req.recruiter.id)) {
            return res.json({ success: false, message: "Recruiter not authorised to access this job" });
        }

        job.package = package;
        job.save();

        return res.json({ success: true, message: "Job package updated successfully", job });

    } catch (error) {
        const message = errorHandler(error);
        return res.status(401).json({ success: false, message });
    }

}

module.exports.updateSelection = async (req, res) => {
    const jobid = req.params.id;

    // Selection Process / Round Model info
    const { applicationDeadline, ppt, pptDate, resumeShortlisting, resumeShortlistingDate, writtenTest, groupDiscussion, interview, expectedRounds, testType, interviewType, testDescription, interviewDescription } = req.body;

    if (!applicationDeadline) {
        return res.status(401).json({ success: false, message: "Application deadline required" });
    }

    try {
        const job = await JobModel.findById(jobid);

        if (!job) {
            return res.json({ success: false, message: "The job doesn't exist" });
        }

        if (!(job.recruiter == req.recruiter.id)) {
            return res.json({ success: false, message: "Recruiter not authorised to access this job" });
        }

        const job2 = await JobModel.findByIdAndUpdate(jobid, { applicationDeadline, ppt, pptDate, resumeShortlisting, resumeShortlistingDate, writtenTest, groupDiscussion, interview, expectedRounds, testType, interviewType, testDescription, interviewDescription }, {new: true});

        const rounds = [];

        if (interview) {
            const round = await InterviewRoundModel.create({ job: jobid, roundType: "Interview", type: interviewType, name: "Interview Round 1", description: interviewDescription });

            rounds.push(round._id);
        }
        if (writtenTest) {
            const round = await InterviewRoundModel.create({job:jobid, roundType:"Written Test", type:testType, description:testDescription, name:"Written est 1"});

            rounds.push(round._id);
        }
        job2.rounds = rounds;

        return res.json({success:true, message: "Selection Process has been updated successfully", job:job2});

    } catch (error) {
        const message = errorHandler(error);
        return res.status(401).json({ success: false, message });
    }

}

module.exports.login = async (req, res) => {
    // console.log(req.query);
    const {userid, password} = req.body;

    if (!userid || !password) {
        return res.status(401).json({ success: false, message: "Userid or password missing" });
    }
    try {
        const Recruiter = await RecruiterModel.findOne({ userid }).populate({ path: "coordinator", select: "-password", populate: { path: "student" } }).populate("contact").exec();

        if (!Recruiter) {
            return res.status(401).json({ success: false, message: "No recruiter found" });
        }

        if (await Recruiter.matchPassword(password)) {
            return res.json({ success: true, message: "Logged in successfully", recruiter: Recruiter, token: generateToken(Recruiter._id) });
        }

        return res.status(401).json({ success: false, message: "Userid or password doesn't match" });

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Login failed" });
    }

}

module.exports.getJobs = async (req, res) => {
    const recruiterid = req.recruiter._id;

    try {
        const jobs = await JobModel.find({recruiter:recruiterid});

        res.json({success: true, jobs});
        
    } catch (error) {
        res.status(401).json({success:false, message: "Some error occured"});
    }
}

module.exports.deleteJob = async (req, res) => {
    const recruiterid = req.recruiter._id;

    const jobid = req.params.id;

    try {
        const job = await JobModel.findById(jobid);
        if (!job) {
            return res.status(401).json({success:false, message: "Invalid jobid"});
        }
        if (!(job.recruiter == recruiterid)) {
            return res.status(401).json({success:false, message: "User not authorised to remove this job"});
        }
        await JobModel.findByIdAndDelete(jobid);

        return res.json({success:true});
        
    } catch (error) {
        const message = errorHandler(error);
        return res.status(401).json({success:false, message});
    } 
}