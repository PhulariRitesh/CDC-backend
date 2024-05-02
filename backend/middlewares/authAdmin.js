const AdminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");

module.exports.authAdmin = async (req, res, next) => {
    let token;
    console.log(req.headers.authorization);
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("token: ",token);
    
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded);


      req.admin = await AdminModel.findById(decoded._id).select("-password");
      
      if (!req.admin){
        return res.status(401).json({success:false, message:"Token Expired"});
      }
      console.log("Admin authorised:",req.admin)
      next();

    } catch (error) {
      console.log(error)
      return res.status(401).json({success:false, message:"Authorisation failed: Invalid Token"})
    }
  }

  if (!token) {
    res.status(401).json({success: false, message: "Not Authorised: No token"})
  }
    
}