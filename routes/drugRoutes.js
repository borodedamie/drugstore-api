const express = require('express');
const router = express.Router();
const { createDrug, getDrugs, getDrug, updateDrug, deleteDrug } = require('../controllers/drugController');

router.route('/').get(getDrugs).post(createDrug)
router.route('/:id').get(getDrug).put(updateDrug).delete(deleteDrug)

module.exports = router;