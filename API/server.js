const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const adminRoutes = require('./routes/adminRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

connectDB()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/jetski', require('./routes/jetskiRoutes'));
app.use(errorHandler);
app.listen(port, () => console.log(`server started on port ${port}`));