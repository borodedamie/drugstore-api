const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from headers
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.SECRET);

            // Get user from the token
            req.user = await User.findById(decoded._id).select('-password');

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not Authorized');
        }
    } else if (req.user && req.user.provider === 'facebook') {
        // User is authenticated through Facebook
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});


exports.permit = (...permittedRoles) => {
    return asyncHandler(async (req, res, next) => {
        token = req.headers.authorization.split(' ')[1]

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //get user from the token 
        req.user = await User.findById(decoded.id).select('-password')

        if (req.user && permittedRoles.includes(req.user.role)) {
            next()
        } else {
            res.status(403)
            throw new Error('User is forbidden from accessing this resource.')
        }
    })
}
