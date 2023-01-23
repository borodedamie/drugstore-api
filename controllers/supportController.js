const Support = require('../models/supportModel')

exports.createSupport = async (req, res) => {
    try {
        const { subject, message, status, dateClosed } = req.body;

        const support = new Support({
            customer: req.user,
            subject,
            message, 
            status,
            dateClosed
        });
        await support.save();

        res.status(201).json({ message: 'Support ticket created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getSupports = async (req, res) => {
    try {
        const supports = await Support.find();

        res.status(200).json(supports);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.updateSupport = async (req, res) => {
    try {
        const support = await Support.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.status(200).json(support);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteSupport = async (req, res) => {
    try {
        const support = await Support.findByIdAndDelete(req.params.id);

        if (!support) throw new Error('Support not found');

        res.status(200).json({ message: 'Support Ticket deleted successfully'});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}