const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Smart Study Assistant API is Running! 🚀');
});

app.listen(PORT, () => {
    console.log(`Server is purring on port ${PORT}`);
});