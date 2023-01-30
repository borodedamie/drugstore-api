const Order = require('../models/orderModel');
const { v4: uuidv4 } = require('uuid');
const Store = require('../models/storeModel');
const Drug = require('../models/drugModel');
const socketIo = global.socketIo;
const admin = require('firebase-admin');

const sendPushNotification = async (token, payload) => {
    try {
        const response = await admin.messaging().sendToDevice(token, payload);

        console.log('Push notification sent successfully:', response);
    } catch (error) {
        console.log('Error sending push notification:', error);
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod } = req.body;

        const orderNumber = uuidv4();

        const order = new Order({
            orderNumber,
            user: req.user,
            items,
            status: 'processing',
            deliveryOption: 'same day',
            deliveryAddress,
            paymentMethod
        });

        await order.save();

        // notify the stores associated with the drugs in the order
        const storeIds = new Set()

        for (const item of items) {
            const drug = await Drug.findById(item.drug);
            storeIds.add(drug.store);
        }

        for (const storeId of storeIds) {
            const store = await Store.findById(storeId);
            socketIo.to(store.socketId).emit('place-order', { order });
        }

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user });

        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { orderNumber, status } = req.body;

        const order = await Order.findOne({ orderNumber });
        const user = order.user;

        await Order.updateOne({ orderNumber }, { $set: { status } });
  
        socketIo.emit('order-status-updated', { orderNumber, status });

        if (user.pushToken) {
            const payload = {
                notification: {
                    title: 'Order status update',
                    body: `Your order (${orderNumber}) status has been updated to ${status}.`,
                    sound: 'default'
                }
            };

            sendPushNotification(user.pushToken, payload);
        }

        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
