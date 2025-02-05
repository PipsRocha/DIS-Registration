const express = require('express');
const { createPayment } = require('../api/easypay');
const router = express.Router();

router.post('/payment', async (req, res) => {
    try {
        const { name, email, amount, phone, vat, type } = req.body;
        if (!type) {
            return res.status(400).json({ error: "Payment type is required" });
        }

        //console.log('Request Body:', req.body);

        const paymentData = {
            capture: {
                descriptive: "DIS Registration"
            },
            currency: "EUR",
            value: amount,
            method: type,
            customer: {
                name: name,
                email: email,
                phone: phone,
                phone_indicative: '+351',
                key: `${name}-${amount}`,
                fiscal_number: vat
            },
        };
        //console.log("Payment Data:", JSON.stringify(paymentData, null, 2));

        const response = await createPayment(paymentData);
        
        res.json(response);
    } catch (err) {
        if (err.response && err.response.status) {
            // EasyPay API returned an error
            res.status(err.response.status).json({ error: err.response.data });
        } else {
            // Internal server error
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
});

module.exports = router;