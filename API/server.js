const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express()

app.get('/api/jetski', (req, res) => {
    res.json({message: "Get All Jetski"})
})

app.listen(port, () => console.log(`server started on port ${port}`))