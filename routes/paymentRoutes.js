const express = require('express');
const router = express.Router();
const { payment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('', protect, payment);

module.exports = router;