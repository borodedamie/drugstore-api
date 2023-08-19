const Store = require('../models/storeModel');
const Drug = require('../models/drugModel');
const mongoose = require('mongoose');
const {Client} = require('@googlemaps/google-maps-services-js');
const client = new Client({});

exports.registerStore = async (req, res) => {
    try {
        const { name, address, phone } = req.body;

        // Check if a store with the same address already exists
        const existingStore = await Store.findOne({ address });
        if (existingStore) {
            return res.status(400).json({ error: 'A store with this address already exists' });
        }

        const result = await client.geocode({
            params: {
                address: address,
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        const location = {
            type: 'Point',
            coordinates: [
                result.data.results[0].geometry.location.lng,
                result.data.results[0].geometry.location.lat,
            ],
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
        const { drug } = req.query;

        if (!drug) {
            return res.status(400).json({ error: 'Drug must be provided' });
        }

        // Use an aggregation pipeline to find stores that have the drug in stock
        let stores = await Store.aggregate([
            {
                $lookup: {
                    from: 'drugs',
                    localField: 'availability.drug',
                    foreignField: '_id',
                    as: 'drugs'
                }
            },
            {
                $match: {
                    'drugs.name': { $regex: new RegExp(`^${drug}$`, 'i') }
                }
            }
        ]);

        res.status(200).json(stores);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, address, phone } = req.body;

        const result = await client.geocode({
            params: {
                address: address,
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        const location = {
            type: 'Point',
            coordinates: [
                result.data.results[0].geometry.location.lng,
                result.data.results[0].geometry.location.lat,
            ],
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
}; 

exports.addDrug = async (req, res) => {
    try {
        const { storeId, drugId, quantity } = req.body;

        //validating the store and drug id passed
        if (!mongoose.Types.ObjectId.isValid(storeId) || !mongoose.Types.ObjectId.isValid(drugId)) {
            return res.status(400).json({ error: "Invalid store or drug id" });
        }

        // checking if the store and drug exist
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const drug = await Drug.findById(drugId);
        if (!drug) {
            return res.status(404).json({ error: "Drug not found" });
        }

        // checking if the drug is already in the store availability list
        const drugAvailability = store.availability.find(item => item.drug.toString() === drugId);
        if (drugAvailability) {
            return res.status(400).json({ error: "Drug is already in the store availability list" });
        }

        // adding the drug to the store availability list
        store.availability.push({ drug: drugId, quantity });

        await store.save();
        res.status(200).json({ message: 'Drug added to availability list successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

};

exports.removeDrug = async (req, res) => {
    try {
        const { storeId, drugId } = req.body;

        //validating the store and drug id passed
        if (!mongoose.Types.ObjectId.isValid(storeId) || !mongoose.Types.ObjectId.isValid(drugId)) {
            return res.status(400).json({ error: "Invalid store or drug id" });
        }

        // checking if the store and drug exist
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const drug = await Drug.findById(drugId);
        if (!drug) {
            return res.status(404).json({ error: "Drug not found" });
        }

        // checking if the drug is in the store availability list
        const drugAvailability = store.availability.find(item => item.drug.toString() === drugId);
        if (!drugAvailability) {
            return res.status(404).json({ error: "Drug not found in the store availability list" });
        }

        // removing the drug from the store availability list
        store.availability = store.availability.filter(item => item.drug.toString() !== drugId);

        await store.save();
        res.status(200).json({ message: 'Drug removed from availability list successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateDrugAvailability = async (req, res) => {
    try {
        const { storeId, drugId, quantity } = req.body;

        // validating the store and drug id passed
        if (!mongoose.Types.ObjectId.isValid(storeId) || !mongoose.Types.ObjectId.isValid(drugId)) {
            return res.status(400).json({ error: "Invalid store or drug id" });
        }

        // checking if the store and drug exist
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const drug = await Drug.findById(drugId);
        if (!drug) {
            return res.status(404).json({ error: "Drug not found" });
        }

        // checking if the drug is in the store availability list
        const drugAvailability = store.availability.find(item => item.drug.toString() === drugId);
        if (!drugAvailability) {
            return res.status(404).json({ error: "Drug not found in the store availability list" });
        }

        // updating the availability of the drug
        await Store.updateOne({ _id: storeId, 'availability.drug': drugId }, { $set: { "availability.$.quantity": quantity } });

        res.status(200).json({ message: 'Availability updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
