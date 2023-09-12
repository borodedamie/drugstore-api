const express = require('express');
const router = express.Router();
const { createDrug, getDrugs, getDrug, updateDrug, deleteDrug } = require('../controllers/drugController');
const multer = require('multer');

/**
* @openapi
* /drugs:
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
*               drugImageUrl:
*                 type: string
*               drugImageName:
*                 type: string
*               store:
*                 type: object
*             required:
*               - name
*               - dosage
*               - price
*               - drugImageUrl
*               - drugImageName
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
* /drugs/{id}:
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/drugs')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    }
});

router.get('/store/:storeId', getDrugs)
router.post('/', upload.single('drugImage'), createDrug);
router.route('/:id').get(getDrug).put(upload.single('drugImage'), updateDrug).delete(deleteDrug);

module.exports = router;