const Support = require('../models/supportModel')

exports.createSupport = async (req, res) => {
    try {
        const { subject, message } = req.body;

        const support = new Support({
            customer: req.user,
            subject,
            message, 
        });
        await support.save();

        res.status(201).json({ message: 'Support ticket created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getSupport = async (req, res) => {
    try {
        const support = await Support.findById(req.params.id);
        if (!support) return res.status(404).json({ message: 'Support ticket not found'});

        res.status(200).json(support);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.updateSupport = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;

        const dateClosed = (status === 'Closed') ? Date.now() : undefined;
        const support = await Support.findByIdAndUpdate(req.params.id, { status, assignedTo, dateClosed }, { new: true });

        if (!support) return res.status(404).json({ message: 'Support ticket not found' });

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