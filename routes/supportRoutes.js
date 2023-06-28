const express = require('express');
const router = express.Router();
const { createSupport, getSupport, updateSupport, deleteSupport } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

/**
* @openapi
* /api/supports:
*   post:
*     tags:
*       - Support
*     description: Create a new support ticket
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               subject:
*                 type: string
*               message:
*                 type: string
*             required:
*               - subject
*               - message
*     responses:
*       201:
*         description: Support ticket created successfully
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
* /api/supports/{id}:
*   get:
*     tags:
*       - Support
*     description: Get details of a support ticket
*     parameters:
*       - name: id
*         in: path
*         description: ID of the support ticket
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
*             schema:
*               type: array
*       404:
*         description: Not Found
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
*   put:
*     tags:
*       - Support
*     description: Update an existing support ticket
*     security:
*       - bearerAuth: []
*     parameters:
*       - name: id
*         in: path
*         description: ID of the support ticket
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
*               status:
*                 type: string
*               assignedTo:
*                 type: string
*             required:
*               - status
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
*             schema:
*               type: array
*       404:
*         description: Not Found
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
*   delete:
*     tags:
*       - Support
*     description: Delete an existing support ticket
*     security:
*       - bearerAuth: []
*     parameters:
*       - name: id
*         in: path
*         description: ID of the support ticket
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Support Ticket deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*       404:
*         description: Not Found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
 */


router.post('/', protect, createSupport);
router.get('/:id', getSupport);
router.put('/:id', protect, updateSupport);
router.delete('/:id', deleteSupport);

module.exports = router;