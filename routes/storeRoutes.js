const express = require('express');
const router = express.Router();
const { registerStore, getStores, updateDrugAvailability, addDrug, removeDrug } = require('../controllers/storeController');

router.post('/register', registerStore);
router.get('/', getStores);
router.patch('/update-drug-availability', updateDrugAvailability)
router.post('/add-drug', addDrug)
router.delete('/remove-drug', removeDrug)

module.exports = router;