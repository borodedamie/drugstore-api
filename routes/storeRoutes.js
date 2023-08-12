const express = require('express');
const router = express.Router();
const { registerStore, getStores, updateDrugAvailability, addDrug, removeDrug } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

/**
* @openapi
* /stores/register:
*   post:
*     tags:
*       - Store
*     description: Register Store
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
*       201:
*         description: Store registered successfully.
*       400:
*         description: Bad Request.
*
* /stores:
*   get:
*     tags:
*       - Store
*     description: Get Stores
*     parameters:
*       - in: query
*         name: address
*         schema:
*           type: string
*       - in: query
*         name: distance
*         schema:
*           type: number
*       - in: query
*         name: drug
*         schema:
*           type: string
*       - in: query
*         name: latitude
*         schema:
*           type: number
*       - in: query
*         name: longitude
*         schema:
*           type: number
*     responses:
*       200:
*         description: Stores retrieved successfully.
*       400:
*         description: Bad Request.
*
* /stores/update-drug-availability:
*   post:
*     tags:
*       - Drug Availability
*     summary: Update Drug Availability
*     description: Update the availability of a drug in a store
*     parameters:
*       - in: query
*         name: id
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               storeId:
*                 type: string
*               drugId:
*                 type: string
*               quantity:
*                 type: integer
*     responses:
*       200:
*         description: Availability updated successfully
*       400:
*         description: Invalid store or drug id, or error message from catch block
*       404:
*         description: Store not found, Drug not found, or Drug not found in the store availability list
*
* /stores/add-drug:
*   post:
*     tags:
*       - Drug Availability
*     description: Add a drug to the availability list of a store
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               storeId:
*                 type: string
*               drugId:
*                 type: string
*               quantity:
*                 type: integer
*     responses:
*       200:
*         description: Drug added to availability list successfully
*       400:
*         description: Invalid store or drug id, Drug is already in the store availability list, or error message from catch block
*       404:
*         description: Store not found or Drug not found
*
* /stores/remove-drug:
*   delete:
*     tags:
*       - Drug Availability
*     description: Remove a drug from the availability list of a store
*     parameters:
*       - in: query
*         name: storeId
*         required: true
*         schema:
*           type: string
*       - in: query
*         name: drugId
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Drug removed from availability list successfully
*       400:
*         description: Invalid store or drug id, or error message from catch block
*       404:
*         description: Store not found or Drug not found
*/

router.post('/register', registerStore);
router.get('/', getStores);
router.patch('/update-drug-availability', protect, updateDrugAvailability)
router.post('/add-drug', addDrug)
router.delete('/remove-drug', removeDrug)

module.exports = router;