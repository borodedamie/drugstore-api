const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { transporter } = require('../config/nodemailer');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authorized, no token' });
        } else {
            res.status(200).json(req.user);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// exports.passwordReset = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(401).json({ error: 'User not found' });
//         }

//         const token = crypto.randomBytes(20).toString('hex');

//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() + 3600000; //expires in one hour
//         await user.save();

//         const mailOptions = {
//             from: 'odamie3@gmail.com',
//             to: email,
//             subject: 'Password reset request',
//             text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n 
//             Please click on the following link, or paste this into your browser to complete the process:\n\n 
//             ${req.protocol}://${req.get('host')}/api/users/reset/${token}\n\n 
//             If you did not request this, please ignore this email and your password will remain unchanged.\n`
//         };

//         transporter.sendMail(mailOptions, function (err, info) {
//             if (err) {
//                 console.error('there was an error: ', err);
//                 res.status(400).json('there was an error: ', err);
//             } else {
//                 console.log('here is the res: ', info.response);
//                 res.status(200).json('recovery email sent');
//             }
//         });

//         res.status(200).json({ url: `${req.protocol}://${req.get('host')}/api/users/reset/${token}` })
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

        req.session.otp = otp;
        req.session.cookie.maxAge = 15 * 60 * 1000; //expires in 15 minutes

        const mailOptions = {
            from: 'odamie3@gmail.com',
            to: email,
            subject: 'OTP for password reset',
            text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error('there was an error: ', err);
                res.status(400).json('there was an error: ', err);
            } else {
                console.log('here is the res: ', info.response);
                res.status(200).json('OTP sent to email');
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (req.session.otp !== otp) {
            return res.status(401).json({ error: 'Incorrect OTP' });
        }

        user.password = newPassword;
        await user.save();

        req.session.destroy();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
