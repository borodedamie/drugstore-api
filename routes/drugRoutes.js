const express = require('express');
const router = express.Router();
const { createDrug, getDrugs, getDrug, updateDrug, deleteDrug } = require('../controllers/drugController');

/**
* @openapi
* /api/drugs:
*   get:
*     tags:
*       - Drug
*     description: Get all drugs
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
*             schema:
*               type: array
*       400:
*         description: Bad Request
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*   post:
*     tags:
*       - Drug
*     description: Create a new drug
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*               dosage:
*                 type: string
*               price:
*                 type: number
*               store:
*                 type: string
*             required:
*               - name
*               - dosage
*               - price
*               - store
*     responses:
*       201:
*         description: Drug created successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*       400:
*         description: Bad Request
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*
* /api/drugs/{id}:
*   get:
*     tags:
*       - Drug
*     description: Get a specific drug by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
*             schema:
*               type: object
*       404:
*         description: Drug not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*   put:
*     tags:
*       - Drug
*     description: Update a specific drug by ID
*     parameters:
*       - in: path
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
*               name:
*                 type: string
*               dosage:
*                 type: string
*               price:
*                 type: number
*               store:
*                 type: string
*             required:
*               - name
*               - dosage
*               - price
*               - store
*     responses:
*       200:
*         description: Drug updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*       404:
*         description: Drug not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*   delete:
*     tags:
*       - Drug
*     description: Delete a specific drug by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Drug deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*       404:
*         description: Drug not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*/

router.route('/').get(getDrugs).post(createDrug);
router.route('/:id').get(getDrug).put(updateDrug).delete(deleteDrug);

module.exports = router;