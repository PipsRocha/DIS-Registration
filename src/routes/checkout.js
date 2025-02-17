const express = require('express');
const { createPayment } = require('../api/easypay');
const { createRegistrant } = require('../notion');
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
                key: `${name}-${amount}`,
                fiscal_number: vat
            },
        };
        //console.log("Payment Data:", JSON.stringify(paymentData, null, 2));

        const response = await createPayment(paymentData);
        
        console.log("API Response:", JSON.stringify(response, null, 2));
        // Handle the response based on the payment method type
        if (response && response.method) {
            console.log("I am in");
            if (response.method.type === 'mb') {
                // Handle Multibanco response
                const { status, entity, reference } = response.method;
                res.json({ method: 'mb', status, entity, reference });
            } else if (response.method.type === 'cc') {
                // Handle Credit Card response
                const { url, status } = response.method;
                res.json({ method: 'cc', status, url });
            } else if (response.method.type === 'vi') {
                // Handle Virtual IBAN response
                const { iban, status } = response.method;
                res.json({ method: 'vi', status, iban });
            } else {
                res.json(response);
            }
            createRegistrant(req.body);

        } else {
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    } catch (err) {
        console.error("Error making payment:", err);
        if (err.response && err.response.status) {
            res.status(err.response.status).json({ error: err.response.data });
        } else {
            res.status(500).json({ error: "An unexpected error occurred 2" });
        }
    }
});

module.exports = router;