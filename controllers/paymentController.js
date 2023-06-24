const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);

exports.payment = async (req, res) => {
    try {
        const payload = {
            card_number: req.body.card_number,
            cvv: req.body.cvv,
            expiry_month: req.body.expiry_month,
            expiry_year: req.body.expiry_year,
            currency: 'NGN',
            amount: req.body.amount,
            email: req.body.email,
            tx_ref: 'MC-3654b',
            redirect_url: 'https://your-awesome.app/payment-redirect',
            authorization: {
                mode: 'pin',
                pin: req.body.pin
            },
            enckey: process.env.FLUTTERWAVE_ENCRYPTION_KEY
        }
        await flw.Charge.card(payload)
            .then(response => {
                req.session.flw_ref = response.data.flw_ref
                res.status(200).json(response)
            })
    } catch (error) {
        // Return the error message
        res.status(400).send(error.response.data);
    }
};

exports.validate = async (req, res) => {
    try {
        const response = await flw.Charge.validate({
            otp: req.body.otp,
            flw_ref: req.session.flw_ref
        });

        if (response.data.status === 'successful' || response.data.status === 'pending') {
            // Verify the payment
            const transactionId = response.data.id;

            const transaction = flw.Transaction.verify({ id: transactionId });

            if (transaction.data.status == "successful") {
                return res.status(200).json({ message: 'transaction successful.' });
            } else if (transaction.data.status == "pending") {
                // Schedule a job that polls for the status of the payment every 10 minutes
                transactionVerificationQueue.add({ id: transactionId });

                return res.status(102).json({ message: 'transaction is been processed.' });
            }
        }

        res.status(200).json(response.data);
    } catch (error) {
        // Return the error message
        res.status(400).send(error.response.data);
    }
}