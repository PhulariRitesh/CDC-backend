const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "centinellegends124@gmail.com",
        pass: "vrfs gyrl qrao sczz",
    },
});

const mailOptions = {
    from: "centinellegends124@gmail.com",
    to: null,
    subject: "Nodemailer Test",
    html: "Email content",
};

module.exports.sendCredentials = (toEmail, company, userid, password) => {
    if (toEmail && userid && password && company){

        mailOptions.to = toEmail;
        mailOptions.subject = "IIT Goa CDC Recruiter Credentials";
        mailOptions.html = `<h2> ${company} <h2> <h3>User Credential<h3> Userid: ${userid} <br> Password: ${password} <br>`


        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              // do something useful
            }
        });
    } else {
        console.log("Email Auth: Data Missing");
    }
    
}

module.exports.sendResetPasswordLink = (toEmail, name, link) => {
    if (toEmail && name && link ){
        mailOptions.to = toEmail;
        mailOptions.subject = "IIT Goa CDC Reset Password";
        mailOptions.html = `<h2>${name}</h2><h3>Reset Password:<h3> link: ${link}`;


        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              // do something useful
            }
        });
    } else {
        console.log("Email Auth - Password Reset: Data Missing");
    }
}

