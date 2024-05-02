const router = require("express").Router();
const {postApplication, testAuth, createJob,deleteJob, updateDescription, updateEligibility, updatePackage, updateSelection, login, getJobs} = require("../controllers/recruiterController");
const {authRecruiter} = require("../middlewares/authRecruiter");

router.post("/apply", postApplication);

router.get("/test", authRecruiter, testAuth);
router.post("/login", login);
router.post("/createJob", authRecruiter, createJob);
router.post("/job/updateDescription/:id", authRecruiter, updateDescription);
router.post("/job/updateEligibility/:id", authRecruiter, updateEligibility);
router.post("/job/updatePackage/:id", authRecruiter, updatePackage);
router.post("/job/updateSelection/:id", authRecruiter, updateSelection);
router.get("/getJobs", authRecruiter, getJobs);
router.get("/deleteJob/:id", authRecruiter, deleteJob);

module.exports = router;