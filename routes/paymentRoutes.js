const express = require('express');
const router = express.Router();
const { payment, validate } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

/**
* @openapi
* /api/payments:
*   post:
*     tags:
*       - Payment
*     description: Initiate payment with payment gateway
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               card_number:
*                 type: string
*               cvv:
*                 type: string
*               expiry_month:
*                 type: string
*               expiry_year:
*                 type: string
*               amount:
*                 type: number
*               email:
*                 type: string
*                 format: email
*               pin:
*                 type: string
*             required:
*               - card_number
*               - cvv
*               - expiry_month
*               - expiry_year
*               - amount
*               - email
*               - pin
*     responses:
*       200:
*         description: Payment initiated successfully.
*       400:
*         description: Bad Request.
*
* /api/payments/validate:
*   post:
*     tags:
*       - Payment
*     description: Validate payment initialization
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               otp:
*                 type: string
*             required:
*               - otp
*     responses:
*       102:
*         description: Transaction is being processed.
*       200:
*         description: Transcation successful.
*/

router.post('', protect, payment);
router.post('/validate', protect, validate);

module.exports = router;