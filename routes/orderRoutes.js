const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

/**
* @openapi
* /api/orders/create-order:
*   post:
*     tags:
*       - Order
*     description: Create a new order with items, delivery address, and payment method
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               items:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     drug:
*                       type: string
*                     quantity:
*                       type: integer
*                 minItems: 1
*               deliveryAddress:
*                 type: string
*               paymentMethod:
*                 type: string
*             required:
*               - items
*               - deliveryAddress
*               - paymentMethod
*     responses:
*       201:
*         description: Order created successfully
*       400:
*         description: Bad Request
*
* /api/orders:
*   get:
*     tags:
*       - Order
*     summary: Get User Orders
*     description: Get the orders associated with the authenticated user
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Order'
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
* /api/orders/{id}:
*   put:
*     tags:
*       - Order
*     summary: Update Order Status
*     description: Update the status of an order
*     security:
*       - bearerAuth: []
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
*               orderNumber:
*                 type: string
*               status:
*                 type: string
*             required:
*               - orderNumber
*               - status
*     responses:
*       200:
*         description: Order status updated successfully
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
*/

router.post('/create-order', protect, createOrder);
router.get('/', protect, getOrders);
router.put('/:id', updateOrder);

module.exports = router;