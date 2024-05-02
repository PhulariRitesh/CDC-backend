const express = require("express")
const path = require("path")
const connectDB = require("./config/db")


// Routers
const recruiterRoute = require("./routes/recruiterRoute");
const adminRoute = require("./routes/adminRoute");
const credentialsRoute = require("./routes/credentialsRoute");

// Initialization
require("dotenv").config({path:path.join(__dirname,"./config.env")})
const app = express()
const PORT = process.env.PORT || 5000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started at http://localhost:5000");
    })
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set("view engine","ejs");
app.set('views', __dirname + '/views');



// Routes
app.use("/recruiter",recruiterRoute);
app.use("/admin/",adminRoute);
app.use("/credentials/",credentialsRoute);

app.use("*",(req,res) => {
    res.status(404).json({success: false, message:"Resource not found"})
})




