const express = require('express');
const router = express.Router();
const { getCartItems, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCartItems);
router.post('/add-to-cart', protect, addToCart);
router.post('/remove-from-cart', protect, removeFromCart);

module.exports = router;
