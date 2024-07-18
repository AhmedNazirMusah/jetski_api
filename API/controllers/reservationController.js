const asyncHandler = require('express-async-handler')

const Reservation = require('../models/reservationModel')

// @desc    Get jetskis
// @route   GET /api/resevations
// @access  Private
const getReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ user: req.user.id }).populate('jetskis');
    
    // Aggregate jetskis from all reservations

    const jetskis = reservations.reduce((acc, reservation) => {
      reservation.jetskis.forEach(jetski => {
        acc.push({
          jetski,
          starting_date: reservation.startDate,
          end_date: reservation.endDate,
        });
      });
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

  const deleteReservation = asyncHandler(async (req, res) => {
    console.log(`Received request to delete reservation with ID: ${req.params.id}`);
    const reservation = await Reservation.findById(req.params.id)
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error('Invalid reservation ID');
    }

    if (!reservation) {
      res.status(400)
      throw new Error('Reservation not found')
    }
  
    // Check for user
  
    if (!req.user) {
      res.status(401)
      throw new Error('User not found')
    }
  
    // Make sure the logged in is the admin
    if (reservation.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('User not authorized')
    }
  
    await Reservation.deleteOne({ _id: req.params.id });
  
    res.status(200).json({ id: req.params.id })
  })

//update to add update and delete reservation
  
module.exports = {
    getReservations,
    addReservation,
    deleteReservation,
}