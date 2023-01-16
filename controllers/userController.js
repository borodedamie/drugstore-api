const User = require('../models/userModel');
const jwt = require('jsonwebtoken')

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
            return res.status(401).json({ error: 'User not found' })

        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incalid email or password'});
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true
        });
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}