const express = require('express')
const https = require('https')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT;

const API_KEY = process.env.API_KEY;

const TEST_ACCOUNT_ID = process.env.ACCOUNT_ID;
const TEST_API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'files')))
app.use('/images', express.static(path.join(__dirname, 'images')))


app.post('/checkoutmanifest', createCheckoutSession)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/iframeUrl', (req, res) => {
  res.send(process.env.IFRAME_URL || '')
})

app.listen(PORT, () => {
  console.log(`Checkout page running on http://localhost:${PORT}`)
})

/**
 * Uses the Account ID and API Key to send an authenticated request from this server
 * to easypay's APIs, creating a new Checkout Session.
 * Receives a Checkout Manifest and returns it to the client, which will use it
 * to initialize the Checkout SDK in the client side.
 */
function createCheckoutSession(req, res) {
    const accountId = TEST_ACCOUNT_ID;
    const apiKey = TEST_API_KEY;
    const host = API_URL;

    const { personalInfo, cartTotal, paymentType } = req.body;
    console.log("Request Body:", req.body);  // Log the request body
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let payment = {
        methods: [paymentType],
        type: 'sale',
        capture: {
        transaction_key: 'string',
        descriptive: 'Descriptive Example',
        },
        currency: 'EUR',
        expiration_time: tomorrow.toISOString().slice(0, 16).replace('T', ' '),
    };

    let order = {
        value: cartTotal,
        key: 'order-key',
        items: [
        {
            description: 'Conference Registration',
            quantity: 1,
            key: 'registration',
            value: cartTotal,
        },
        ],
    };

    const payload = JSON.stringify({
        type: ['sale'],
        payment: payment,
        order: order,
        config: {},
        customer: {
            name: personalInfo.name,
            email: personalInfo.email,
            phone: '',
            phone_indicative: '',
            fiscal_number: '',
            key: 'Key Example',
            language: 'EN',
        },
    });
    console.log("Payload:", payload);  // Log the payload

    const options = {
        hostname: host,
        path: '/2.0/checkout',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
        AccountId: accountId,
        ApiKey: apiKey,
        },
    }

    function makeRequest(attempts) {
        const req = https.request(options, function (response) {
        let manifest = '';
        response.on('data', function (chunk) {
            manifest += chunk;
        });
        response.on('end', function () {
            console.log('API Response:', response.statusCode, manifest); // Log status code and manifest
            if (response.statusCode !== 200) {
                console.error(`Easypay API error: ${response.statusCode} - ${manifest}`);
                res.status(500).send(`Easypay API error: ${response.statusCode} - ${manifest}`);
                return;
            }
            res.send(manifest);
        });   
    });

        req.on('error', function (e) {
        console.error(`Error: ${e.message}`);
        if (attempts > 1) {
            console.log(`Retrying... (${attempts - 1} attempts left)`);
            makeRequest(attempts - 1);
        } else {
            res.status(500).send('Unable to create checkout session. Please try again later.');
        }
        });

        req.write(payload);
        req.end();
    }

    makeRequest(3); // Retry up to 3 times
}