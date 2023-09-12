const express = require('express');
const router = express.Router();
const { getCartItems, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

/**
* @openapi
* /carts:
*   get:
*     tags:
*       - Cart
*     description: Get items in the user's cart
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
*             schema:
*               type: array
*       500:
*         description: Internal Server Error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*
* /carts/add-to-cart:
*   post:
*     tags:
*       - Cart
*     description: Add a drug item to the user's cart
*     security:
*       - bearerAuth: []
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
*                 type: number
*             required:
*               - storeId
*               - drugId
*               - quantity
*     responses:
*       200:
*         description: Drug added to cart successfully
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
*       404:
*         description: Not Found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*       500:
*         description: Internal Server Error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*
* /carts/remove-from-cart:
*   post:
*     tags:
*       - Cart
*     description: Remove an item from the user's cart
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               itemId:
*                 type: string
*             required:
*               - itemId
*     responses:
*       200:
*         description: Item removed from cart successfully
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
*       500:
*         description: Internal Server Error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*/

router.get('/', protect, getCartItems);
router.post('/add-to-cart', protect, addToCart);
router.patch('/remove-from-cart', protect, removeFromCart);

module.exports = router;
