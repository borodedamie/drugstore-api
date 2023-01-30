const express = require('express');
const router = express.Router();
const { createSupport, getSupport, updateSupport, deleteSupport } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSupport);
router.get('/:id', getSupport);
router.put('/:id', protect, updateSupport);
router.delete('/:id', deleteSupport);

module.exports = router;