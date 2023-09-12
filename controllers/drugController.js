const Drug = require('../models/drugModel')
const Store = require('../models/storeModel');
const path = require('path')

exports.createDrug = async (req, res) => {
    try {
        const { name, dosage, price, quantityPerSachet, generalUsage, store } = req.body;

        const storeDB = await Store.findOne({ name: store })

        const url = new URL(req.file.path, `${req.protocol}://${req.get('host')}`).href

        const drug = new Drug({
            name: name,
            dosage: dosage,
            price: price,
            quantityPerSachet: quantityPerSachet,
            generalUsage: generalUsage,
            store: storeDB,
            drugImageUrl: url,
            drugImageName: req.file.originalname
        });
        // save the document to the database
        await drug.save();

        res.status(201).json({ message: 'Drug created successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDrugs = async (req, res) => {
    try {
        const storeId = req.params.storeId;
        const drugs = await Drug.find({ store: storeId }).populate('store');

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

        const { name, dosage, price, quantityPerSachet, generalUsage, store } = req.body;

        const storeDB = await Store.findOne({ name: store });
 
        const url = new URL(req.file.path, `${req.protocol}://${req.get('host')}`).href

        // pass all updated fields to Drug.findByIdAndUpdate
        const drug = await Drug.findByIdAndUpdate(id, { name, dosage, price, quantityPerSachet, generalUsage, store: storeDB, drugImageUrl: url, drugImageName: req.file.originalname }, { new: true });

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
