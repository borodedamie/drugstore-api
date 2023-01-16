const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { transporter } = require('../config/nodemailer');

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id}, process.env.SECRET);
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
            return res.status(401).json({ error: 'Invalid email or password'});
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profile = async (req, res) => {
    try {
        res.status(200).json( req.user )
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

exports.passwordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        // const mailOptions = {
        //     from: '',
        //     to: email,
        //     subject: 'Password reset request',
        //     text: ''
        // };

        // transporter.sendMail(mailOptions, function (error, response) {
        //     if (error) {
        //         console.error('there was an error: ', error);
        //     } else {
        //         console.log('here is the response: ', response);
        //     }
        // });

        res.status(200).json({ url: `${req.protocol}://${req.get('host')}/api/users/reset/${token}`})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}