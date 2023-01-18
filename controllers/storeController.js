const Store = require('../models/storeModel');
const Drug = require('../models/drugModel');
const geocoder = require('node-geocoder')({
    provider: 'opencage',
    apiKey: process.env.OPEN_CAGE
});
const mongoose = require('mongoose');

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

}

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
}

exports.updateDrugAvailability = async (req, res) => {
    try {
        const { storeId, drugId, availability } = req.body;

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
        await Store.updateOne({ _id: storeId, 'availability.drug': drugId }, { $set: { "availability.$.quantity": availability } });

        res.status(200).json({ message: 'Availability updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}