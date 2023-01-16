const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'devonte.boyle37@ethereal.email',
        pass: 'zFE1PHDn2NYGafwX8K'
    }
});
