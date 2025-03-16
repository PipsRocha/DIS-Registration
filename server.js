require('dotenv').config();

const express = require('express');
const path = require('path');
const open = require('open');
const cors = require('cors');

const checkoutRoutes = require('./src/routes/checkout'); // Import routes

const app = express();

app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Attach the routes
app.use('/checkout', checkoutRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    //console.log(`Server running on http://localhost:${PORT}`);
});