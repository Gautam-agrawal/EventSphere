const nodemailer = require('nodemailer');
const error = require('../../../errors/errors')
const { emailHost, emailPort, emailService, emailUser, emailPass, emailSecure } = require('../../../config/config')

const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    service: emailService,
    secure: emailSecure,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

module.exports = async function(mailBody){
    const info = await transporter.sendMail({
        from: emailUser,
        to: mailBody.email,
        subject: mailBody.subject,
        html: mailBody.body
    })
    
    if (Object.values(info.accepted).length){
        return {error: false, message: "Email sent successfully"}
    }
    else{
        return {error: true, code: '001', message: "Failed to send email alert"}
    }

}