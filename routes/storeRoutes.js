const express = require('express');
const router = express.Router();
const { registerStore, getStores } = require('../controllers/storeController');

router.post('/register', registerStore);
router.get('/', getStores);

module.exports = router;