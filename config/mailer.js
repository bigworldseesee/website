var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.zoho.com",
    port: 465,
    secureConnection: true, 
    auth: {
        user: "support@bigworldseesee.com",
        pass: "supersupport"
    }
});

module.exports = smtpTransport;