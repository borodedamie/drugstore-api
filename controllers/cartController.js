const Cart = require('../models/cartModel');
const Store = require('../models/storeModel');

exports.getCartItems = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId }).populate('items.drug');

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { storeId, drugId, quantity, price } = req.body;

        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const drugAvailability = store.availability.find(item => item.drug.toString() === drugId);
        if (!drugAvailability) {
            return res.status(404).json({ error: 'Drug not available in store' });
        }

        if (quantity > drugAvailability.quantity) {
            return res.status(400).json({ error: 'Quantity exceeds available quantity' });
        }

        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            await Cart.create({
                user: userId,
                items: [{ drug: drugId, quantity, price }]
            });
        } else {
            // Check if the item already exists in the cart
            const itemIndex = cart.items.findIndex(item => item.drug.toString() === drugId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
                cart.items[itemIndex].price = price;
            } else {
                // If the item doesn't exist, add it to the cart
                cart.items.push({ drug: drugId, quantity, price });
            }

            await cart.save();
        }

        res.status(200).json({ message: 'Drug added to cart successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;

        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
