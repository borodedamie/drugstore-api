const express = require('express');
const router = express.Router();
const { register, login, profile, update } = require('../controllers/userController');

router.post('/', register)
router.post('/login', login)
router.get('/profile', profile)
router.put('/update', update)

module.exports = router
