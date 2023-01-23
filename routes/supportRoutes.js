const express = require('express');
const router = express.Router();
const { createSupport, getSupports, updateSupport, deleteSupport } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSupport);
router.get('/', getSupports);
router.put('/:id', protect, updateSupport);
router.delete('/:id', deleteSupport);

module.exports = router;