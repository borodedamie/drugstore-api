const express = require('express');
const router = express.Router();
const { register, login, profile, update, passwordReset, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

router.post('/', register);
router.post('/login', login);
router.get('/profile', protect, profile);
router.put('/update', protect, update);
router.post('/request-password-reset', protect, forgotPassword);
router.patch('/password-reset', resetPassword);
// router.post('/password-reset', passwordReset)

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/api/users/auth/facebook' }),
    function (req, res) {
        res.redirect('/');
    });
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router;
