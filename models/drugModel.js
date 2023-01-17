const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
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
});

module.exports = mongoose.model('Drug', drugSchema);