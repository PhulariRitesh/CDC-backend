const router = require("express").Router();
const {forgotPassword, resetPasswordPost, resetPasswordGet} = require("../controllers/passwordController");

router.get("/forgotPassword/:role", forgotPassword);

router.get("/resetPassword/:role/:token", resetPasswordGet);
router.post("/resetPassword/:role/:token", resetPasswordPost);

module.exports = router;