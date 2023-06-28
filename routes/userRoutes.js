const express = require('express');
const router = express.Router();
const { register, login, profile, update, passwordReset, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

/**
* @openapi
* /api/users/register:
*   post:
*     tags:
*       - Register
*     description: User registration
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*             required:
*               - email
*               - password
*     responses:
*       201:
*         description: Token gets generated
*       400:
*         description: Bad Request
*
* /api/users/login:
*   post:
*     tags:
*       - Login
*     description: Login Users
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*               password:
*                 type: string
*             required:
*               - email
*               - password
*     responses:
*       200:
*         description: Login successful, token gets generated.
*       400:
*         description: Bad Request.
*       401:
*         description: Invalid email or password, or User not found.
*
* /api/users/profile:
*   post:
*     tags:
*       - Profile
*     description: Create User Profile 
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*               address:
*                 type: string
*               phone:
*                 type: string
*             required:
*               - name
*               - address
*               - phone 
*     responses:
*       200:
*         description: Profile created successfully.
*       400:
*         description: Bad Request.
*       401:
*         description: Not authorized, no token.
*
* /api/users/update:
*   put:
*     tags:
*       - Profile
*     description: Update User Profile
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*               address:
*                 type: string
*               phone:
*                 type: string
*     responses:
*       200:
*         description: Profile updated successfully.
*       400:
*         description: Bad Request.
*
* /api/users/request-password-reset:
*   post:
*     tags:
*       - Reset Password
*     description: Forgot Password - request password reset via email
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*             required:
*               - email
*     responses:
*       200:
*         description: OTP sent to email.
*       400:
*         description: Bad Request.
*       401:
*         description: User not found.
*
* /api/users/password-reset:
*   patch:
*     tags:
*       - Reset Password
*     description: Reset Password
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 format: email
*               otp:
*                 type: string
*               newPassword:
*                 type: string
*             required:
*               - email
*               - otp
*               - newPassword
*     responses:
*       200:
*         description: Password reset successfully.
*       400:
*         description: Bad Request.
*       401:
*         description: User not found or Incorrect OTP.
*
* /api/users/auth/facebook:
*   get:
*     tags:
*       - Login
*     description: Login via Facebook
*     responses:
*       200:
*         description: Login successful.
*       400:
*         description: Bad Request.
*
* /api/users/auth/google:
*   get:
*     tags:
*       - Login
*     description: Login via Google
*     responses:
*       200:
*         description: Login successful.
*       400:
*         description: Bad Request.
*/


router.post('/register', register);
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
