const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [ 'Open', 'In progress', 'Closed' ],
        default: 'Open'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateClosed: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
