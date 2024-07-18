const express = require('express')
const router = express.Router()
const { getReservations, addReservation, deleteReservation } = require('../controllers/reservationController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getReservations ).post(protect, addReservation)
router.route('/:id').delete(protect, deleteReservation)
module.exports = router