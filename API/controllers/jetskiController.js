const asyncHandler = require('express-async-handler')

const Jetski = require('../models/jetskiModel')

// @desk Get One jetski
// Get /api/jetskis/:id
// private
const getJetInfo = asyncHandler(async (req, res) => {
  const jet = await Jetski.findById(req.params.id)

  res.status(200).json(jet)

})

// @desc    Get jetskis
// @route   GET /api/jetskis
// @access  Private
const getJetskis = asyncHandler(async (req, res) => {
  const jetskis = await Jetski.find()

  res.status(200).json(jetskis)
})

// @desc    Add jetski
// @route   POST /api/jetski
// @access  Private
const setJetski = asyncHandler(async (req, res) => {
  if (!req.body.model && !req.body.year) {
    res.status(400)
    throw new Error('Please add a model and year field')
  }

   const file = req.files?.image;

    let base64Image = null;
    if (file) {
      base64Image = file.data.toString('base64');
    }
   
    const jetski = await Jetski.create({
      admin: req.admin.id,
      model: req.body.model,
      year: req.body.year,
      image: base64Image,
    })


  res.status(200).json(jetski)
})

// @desc    Update goal
// @route   PUT /api/jetski/:id
// @access  Private
const updateJetski = asyncHandler(async (req, res) => {
  const jetski = await Jetski.findById(req.params.id)

  if (!jetski) {
    res.status(400)
    throw new Error('Jetski not found')
  }

  // Check for admin
  if (!req.admin) {
    res.status(401)
    throw new Error('admin not found')
  }

  // Make sure the logged in Admin matches 
  if (jetski.admin.toString() !== req.admin.id) {
    res.status(401)
    throw new Error('Admin not authorized')
  }

  const updateJetski = await Jetski.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updateJetski)
})

// @desc    Delete goal
// @route   DELETE /api/jetski/:id
// @access  Private
const deleteJetski = asyncHandler(async (req, res) => {
  const jetski = await Jetski.findById(req.params.id)

  if (!jetski) {
    res.status(400)
    throw new Error('Jetski not found')
  }

  // Check for admin

  if (!req.admin) {
    res.status(401)
    throw new Error('Admin not found')
  }

  // Make sure the logged in is the admin
  if (goal.admin.toString() !== req.admin.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await Jetski.deleteOne({ _id: req.params.id });

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getJetskis,
  setJetski,
  updateJetski,
  deleteJetski,
  getJetInfo,
}