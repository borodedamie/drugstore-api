const express = require('express');
const router = express.Router();
const { register, login, profile, update, passwordReset } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware')

router.post('/', register)
router.post('/login', login)
router.get('/profile', protect, profile)
router.put('/update', protect, update)
router.post('/password-reset', passwordReset)

module.exports = router
