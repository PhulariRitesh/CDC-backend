const router = require("express").Router();
const {verifyRecruiter,signup, login, addCoordinator, addStudent} = require("../controllers/adminController")
const {authAdmin} = require("../middlewares/authAdmin")

router.post("/signup",signup);
router.get("/login", login);
router.post("/verifyRecruiter/:id", authAdmin, verifyRecruiter);
router.post("/addCoordinator/:id", authAdmin, addCoordinator);
router.post("/addStudent", authAdmin, addStudent);

module.exports = router;