const Store = require('../models/storeModel')
const geocoder = require('node-geocoder')({
    provider: 'opencage',
    apiKey: process.env.OPEN_CAGE
});

exports.registerStore = async (req, res) => {
    try {
        const { name, address, phone } = req.body;

        const result = await geocoder.geocode(address);

        const location = {
            type: 'Point',
            coordinates: [result[0].longitude, result[0].latitude]
        };

        const store = new Store({ name, address, phone, location });

        await store.save();

        res.status(201).json({ message: 'Store registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getStores = async (req, res) => {
    try {
        const { address, distance, drug } = req.query;

        const result = await geocoder.geocode(address);

        const location = {
            type: 'Point',
            coordinates: [result[0].longitude, result[0].latitude]
        };

        let stores = await Store.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [result[0].longitude, result[0].latitude]
                    },
                    $maxDistance: distance
                }
            }
        });

        // filter stores based on availability of the drug
        if(drug){
            stores = stores.filter(store => {
                return store.availability.some(item => item.drug.toString() === drug)
            });
        }

        res.status(200).json(stores);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, address, phone } = req.body;

        const result = await geocoder.geocode(address);

        const location = {
            type: 'Point',
            coordinates: [result[0].longitude, result[0].latitude]
        };

        const store = await Store.findByIdAndUpdate(id, { name, address, phone, location }, { new: true });

        if (!store) throw new Error('Store not found');

        res.status(200).json({ message: 'Store updated successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;

        const store = await Store.findByIdAndDelete(id);

        if (!store) throw new Error('Store not found');

        res.status(200).json({ message: 'Store deleted successfully' })
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}