const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Reservation = require("../models/reservationModel");
const { generateSignedUrl } = require("./jetskiController");

// Helper function to generate signed URLs for jetskis
const generateSignedUrls = async (jetskis) => {
  return await Promise.all(
    jetskis.map(async (jetski) => {
      const url = await generateSignedUrl(jetski.file);
      return {
        model: jetski.model,
        url: url,
      };
    })
  );
};

// @desc    Get reservations
// @route   GET /api/reservations
// @access  Private
const getReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user.id }).populate(
    "jetskis"
  );

  const jetskis = await Promise.all(
    reservations.map(async (reservation) => {
      const jetskisWithUrls = await generateSignedUrls(reservation.jetskis);
      return jetskisWithUrls.map((jetski) => ({
        ...jetski,
        starting_date: reservation.startDate,
        end_date: reservation.endDate,
      }));
    })
  );

  // Flatten the array of jetskis
  const flattenedJetskis = jetskis.flat();

  res.status(200).json(flattenedJetskis);
});

const addReservation = asyncHandler(async (req, res) => {
  if (!req.body.startDate || !req.body.endDate) {
    res.status(400);
    throw new Error("Please add a start and end date");
  }

  const reservation = await Reservation.create({
    user: req.user.id,
    jetskis: req.body.jetskis,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  res.status(200).json(reservation);
});

const deleteReservation = asyncHandler(async (req, res) => {
  console.log(
    `Received request to delete reservation with ID: ${req.params.id}`
  );

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid reservation ID");
  }

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    res.status(400);
    throw new Error("Reservation not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user is the owner
  if (reservation.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Reservation.deleteOne({ _id: req.params.id });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getReservations,
  addReservation,
  deleteReservation,
};
