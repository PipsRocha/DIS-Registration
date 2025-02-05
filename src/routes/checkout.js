const express = require('express');
const { createPayment } = require('../api/easypay');
const router = express.Router();

router.post('/payment', async (req, res) => {
    try {
        const { name, email, amount, type } = req.body;
        if (!type) {
            return res.status(400).json({ error: "Payment type is required" });
        }

        console.log('Request Body:', req.body);

        const paymentData = {
            payment: {
                methods: type,
                type: "sale",
                capture: {
                    descriptive: "Purchase in MyStore"
                },
                currency: "EUR",
                expiration_time: null
            },
            order: {
                items: [
                    {
                        description: "Registration Fee",
                        quantity: 1,
                        key: "registration-fee",
                        value: amount
                    }
                ],
                key: "order",
                value: amount
            },
            buyer: { name, email },
            url_return: {
                success: "/aftercheckout.html",
                error: "https://yourwebsite.com/error"
            }
        };
        console.log("Payment Data:", JSON.stringify(paymentData, null, 2));

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