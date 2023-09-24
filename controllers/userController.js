const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { transporter } = require('../config/nodemailer');

function generateAccessToken(user) {
    return jwt.sign(
        { _id: user._id, email: user.email },
        process.env.SECRET,
        { expiresIn: '1800s' }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { _id: user._id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '90d' }
    );
}

async function verifyRefreshToken(refreshToken, userId) {
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (payload._id !== userId) return false;

        const user = await User.findOne({ _id: userId });
        if (!user) return false;

        // check if token matches the one in DB
        if (refreshToken !== user.refreshToken) return false;

        return true;
    } catch (error) {
        return false;
    }
}

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // save the refresh token
        await User.updateOne({ _id: user._id }, { $set: { refreshToken } });

        res.cookie('access_token', accessToken, { httpOnly: true, secure: true });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true });

        res.status(201).json({ message: 'User registered successfully' });
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

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await User.updateOne({ _id: user._id }, { $set: { refreshToken } });

        res.cookie('access_token', accessToken, { httpOnly: true, secure: false });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: false });

        res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            // send an error message if no user is found
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


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

// refresh token
exports.refreshToken = async (req, res) => {
    try {
        const { userId } = req.body;

        const refreshToken = req.cookies.refresh_token;

        // validate the refresh token
        const isValid = await verifyRefreshToken(refreshToken, userId);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid token, try login again' });
        }
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const accessToken = generateAccessToken(user);

        res.cookie('access_token', accessToken, { httpOnly: true, secure: false });
        res.status(200).json({ message: 'Access token refreshed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.logout = async (req, res) => {
    try {
        const { userId } = req.body;

        const refreshToken = req.cookies.refresh_token;

        // validate the refresh token
        const isValid = await verifyRefreshToken(refreshToken, userId);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid token, try login again' });
        }

        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).json({ error: 'User not found' });
        await User.updateOne({ _id: userId }, { $set: { refreshToken: null } });

        res.cookie('access_token', '', { expires: new Date(0) });
        res.cookie('refresh_token', '', { expires: new Date(0) });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}