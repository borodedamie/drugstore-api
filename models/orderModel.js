const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        drug: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Drug',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            required: true
        }
    }],
    status: {
        type: String,
        required: true,
        enum: [ 'processing', 'shipped', 'delivered' ],
        default: 'processing'
    },
    deliveryOption: {
        type: String,
        enum: [ 'same day', 'next day', 'scheduled' ],
        default: 'same day'
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: Date
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: [ 'cash', 'card' ]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
