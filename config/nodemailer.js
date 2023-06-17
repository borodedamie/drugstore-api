const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'odamie3@gmail.com',
        pass: 'ehektlfejslzcnwp'
    }
});
