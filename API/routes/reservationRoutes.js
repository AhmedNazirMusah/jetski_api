const express = require('express')
const router = express.Router()
const { getReservations, addReservation } = require('../controllers/reservationController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getReservations ).post(protect, addReservation)

module.exports = router