const express = require('express');
const router = express.Router();
require('dotenv').config();

const paypal = require('@paypal/checkout-server-sdk');
const https = require('https');

// Set up the HTTPS agent for secure TLS connections
const agent = new https.Agent({
    keepAlive: true,
    maxSockets: 10,
    minVersion: 'TLSv1.2'
});

// Set up PayPal environment
let environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
let client = new paypal.core.PayPalHttpClient(environment);
client.agent = agent; // Attach the agent to the PayPal client

// Function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

router.post('/', async (req, res) => {
    client.timeout = 10000; // Timeout in milliseconds

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '50.00'
            }
        }],
        application_context: {
            return_url: 'http://localhost:8000/pay/success',
            cancel_url: 'http://localhost:8000/pay/cancel'   
        }
    });

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const order = await client.execute(request);
            const approvalUrl = order.result.links.find(link => link.rel === 'approve').href; // Find approval URL from the response
            res.redirect(approvalUrl); // Redirect to PayPal for approval
            break; // Exit the loop if successful
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                console.error('Max retries reached:', error);
                res.status(500).send('Error creating order');
            } else {
                console.log(`Retrying... (${attempt})`);
                await delay(1000 * attempt); // Exponential backoff
            }
        }
    }
});


// Route to handle successful payment
router.get('/success', async (req, res) => {
    const token = req.query.token;
    const payerID = req.query.PayerID;

    if (!token || !payerID) {
        return res.status(400).send('Missing token or PayerID');
    }

    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        console.log('Capture result:', capture.result); // Log the capture result

        // If the payment is successful, send a confirmation message
        res.send(`Payment successful! Order status: ${capture.result.status}`);
    } catch (error) {
        console.error('Error capturing order:', error);
        res.status(500).send('Error capturing order');
    }
});


// Route to handle payment cancellation
router.get('/cancel', (req, res) => {
    console.log('Payment was cancelled');
    res.send('Payment cancelled');
});

module.exports = router;
