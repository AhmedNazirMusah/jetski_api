const asyncHandler = require('express-async-handler')

const Reservation = require('../models/reservationModel')

// @desc    Get jetskis
// @route   GET /api/resevations
// @access  Private
const getReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ user: req.user.id }).populate('jetskis');
  
       // Aggregate jetskis from all reservations
        const jetskis = reservations.reduce((acc, reservation) => {
          acc.push(...reservation.jetskis);
          return acc;
      }, []);
  
      res.status(200).json(jetskis);
  })

const addReservation = asyncHandler(async (req, res) => {
    if (!req.body.startDate && !req.body.endDate) {
      res.status(400)
      throw new Error('Please add a start and end date')
    }
  
    const reservations = await Reservation.create({
      user: req.user.id,
      jetskis: req.body.jetskis,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    })
  
    res.status(200).json(reservations)
  })

//update to add update and delete reservation
  
module.exports = {
    getReservations,
    addReservation,
}