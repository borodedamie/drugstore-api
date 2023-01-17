const Drug = require('../models/drugModel')
const Store = require('../models/storeModel');

exports.createDrug = async (req, res) => {
    try {
        const { name, dosage, price, store } = req.body;

        const storeDB = await Store.findOne({ name: store })

        const drug = new Drug({ name, dosage, price, store: storeDB });

        await drug.save();

        res.status(201).json({ message: 'Drug created successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDrugs = async (req, res) => {
    try {
        const drugs = await Drug.find().populate('store');

        res.status(200).json(drugs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDrug = async (req, res) => {
    try {
        const { id } = req.params;

        const drug = await Drug.findById(id).populate('store');

        if (!drug) throw new Error('Drug not found');

        res.status(200).json(drug);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.updateDrug = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, dosage, price, store } = req.body;

        const storeDB = await Store.findOne({ name: store })

        const drug = await Drug.findByIdAndUpdate(id, { name, dosage, price, store: storeDB }, { new: true });

        if (!drug) throw new Error('Drug not found');

        res.status(200).json({ message: 'Drug updated successfully' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.deleteDrug = async (req, res) => {
    try {
        const { id } = req.params;

        const drug = await Drug.findByIdAndDelete(id);

        if (!drug) throw new Error('Drug not found');

        res.status(200).json({ message: 'Drug deleted successfully' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
