const nodemailer = require("nodemailer");
const endPoint = "";
//const endPoint = "http://localhost:8000";


var emailUser = function(email, userid) {    
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {user: "", pass: ""}
    });  
    let mailOptions = {
        from: "",
        to: email,				
        subject: `Verify email for DM88`,
        text: "",	
        html: `<!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta charset="utf-8" />
            <title></title>
            <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
            <style> 
                .verify-link button {
                    background: #ff7403;
                    color: #fff;
                    text-decoration: none;                
                    box-shadow: 0 3px 1px rgba(0,0,0,.3);                
                    border: none;
                    border-radius: 3px;
                    padding: 1em 2em;                    
                    cursor: pointer;
                    outline: none;                    
                }               
                
            </style>
        </head>
        <body style="font-family: 'Open Sans', sans-serif;">
            <p style="font-weight:bold">Thank you for signing up!</p>
            <p>Please verify your email by clicking the link below</p>
            <a class = "verify-link" href = "${endPoint}/verifyuser?user=${userid}"> <button>Verify here </button></a>
            <p>Regards,</p>
            <p>DM88</p>
            <a href= "https://diegomary.github.io">diegomary.github.io</a><br/>
            <img  width=150 src="https://diegomary.github.io/static/media/windRoseDark.484b3856.png" />    
        </body>
        </html>`
    };
    transporter.sendMail(mailOptions, (error, info) => {        
        if (error) {					
            console.log(error)
        }
        else {
            console.log(info)
        }
    });			
}




module.exports = emailUser;
