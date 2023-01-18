const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    availability: [{
        drug: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Drug'
        },
        quantity: Number
    }],
    phone: {
        type: String,
        required: true,
    },
    socketId: String
}, {
    timestamps: true
});

storeSchema.index({ location: '2dsphere' });

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;