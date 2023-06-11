const express = require('express');
const router = express.Router();
const { register, login, profile, update, passwordReset } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

router.post('/', register)
router.post('/login', login)
router.get('/profile', protect, profile)
router.put('/update', protect, update)
router.post('/password-reset', passwordReset)

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/api/users/auth/facebook' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router
