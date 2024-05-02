const RecruiterModel = require("../models/recruiterModel");
const jwt = require("jsonwebtoken");


module.exports.authRecruiter = async (req, res, next) => {
    // const {userid, password} = req.body;
    // console.log(req.body);
    // try {
    //     const Recruiter = await RecruiterModel.findOne({userid});
    //     if (Recruiter && password == Recruiter.password){
            
    //         console.log("Recruiter authorised");
    //         req.recruiter = Recruiter;

    //         next();
    //     } else {

    //         res.status(201).json({error: "Recruiter not authorised"})
    //     }
    // } catch (error){
    //     console.log(error);
    //     res.status(400).json({error:"Authorisation failed"})
    // }
    let token;
    console.log(req.headers.authorization);

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
    try {
      token = req.headers.authorization.split(" ")[1];

    
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.recruiter = await RecruiterModel.findById(decoded._id).select("-password");
      if (!req.recruiter){
       return res.status(401).json({success: false, message:"No match of recruiter for the token"});
      }
      next();

    } catch (error) {
      console.log(error);
      return res.status(401).json({success:false, message:"Authorisation failed: Invalid Token"})
    }
  }

  if (!token) {
    res.status(401).json({success: false, message: "Not Authorised: No token"})
  }
    

}