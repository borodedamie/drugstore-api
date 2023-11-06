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
        const { items,
            deliveryAddress,
            subTotal,
            shippingFee,
            grandTotal } = req.body;

        const orderNumber = uuidv4();

        const order = new Order({
            orderNumber,
            user: req.user,
            items,
            deliveryAddress,
            subTotal,
            shippingFee,
            grandTotal
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

            // reduce the quantity of the drug in the availability array of the store
            for (const item of items) {
                for (const availability of store.availability) {
                    if (availability.drug.toString() === item.drug.toString()) {
                        availability.quantity -= item.quantity;
                    }
                }
            }

            await store.save();
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
        const orderId = req.query.orderId;

        const order = await Order.findById(orderId);
        const user = order.user;

        const oldStatus = order.status;

        await Order.updateOne({ _id: orderId }, { $set: req.body });

        const newStatus = req.body.status;

        // only emit the event if the status has changed
        if (oldStatus !== newStatus) {
            socketIo.emit('order-status-updated', { orderNumber: order.orderNumber, status: newStatus });
        }

        // only send the notification if the user has a pushToken and the status has changed
        if (user.pushToken && oldStatus !== newStatus) {
            const payload = {
                notification: {
                    title: 'Order status update',
                    body: `Your order (${order.orderNumber}) status has been updated to ${newStatus}.`,
                    sound: 'default'
                }
            };

            sendPushNotification(user.pushToken, payload);
        }

        res.status(200).json({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
