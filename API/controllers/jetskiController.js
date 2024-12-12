const asyncHandler = require("express-async-handler");
const { uploadToS3, s3 } = require("../config/awsConfig");
const Jetski = require("../models/jetskiModel");
const sharp = require("sharp")


const { getSignedUrl } =  require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const generateSignedUrl = async (fileKey) => {
  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  };

  const command = new GetObjectCommand(getObjectParams);
  try {
    return await getSignedUrl(s3, command, { expiresIn: 5000 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};

// @desk Get One jetski
// Get /api/jetskis/:id
// private
const getJetInfo = asyncHandler(async (req, res) => {
  const jet = await Jetski.findById(req.params.id);

  res.status(200).json(jet);
});

// @desc    Get jetskis
// @route   GET /api/jetskis
// @access  Private
const getJetskis = asyncHandler(async (req, res) => {
  const jetskis = await Jetski.find();
  for (const jet of jetskis) {
    for (const jet of jetskis) {
      jet.url = await generateSignedUrl(jet.file);
    }
  }

  res.status(200).json(jetskis);
});

// @desc    Add jetski
// @route   POST /api/jetski
// @access  Private
const createJetski = asyncHandler(async (req, res) => {
  if (!req.body.model || !req.body.year) {
    res.status(400);
    throw new Error("Please add a model and year field");
  }

  try {
    // resize image before sending to s3 
    const buffer = await sharp(req.file.buffer).resize({height: 1920,width: 1080, fit: "contain"}).toBuffer() 

    const s3Key = `${Date.now()}-${req.file.originalname}`;
    const s3Response = await uploadToS3({
      BucketName: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      contentType: req.file.mimetype,
    });
    console.log(req.file); 
    // Save the jetski data including the file URL
    const jetski = await Jetski.create({
      admin: req.admin.id,
      model: req.body.model,
      year: req.body.year,
      file: s3Key,
      url: "",
    });

    res.status(200).json(jetski);
  } catch (error) {
    console.error("Error handling file:", error);
    throw new Error("File upload failed");
  }
});

// @desc    Update goal
// @route   PUT /api/jetski/:id
// @access  Private
const updateJetski = asyncHandler(async (req, res) => {
  const jetski = await Jetski.findById(req.params.id);

  if (!jetski) {
    res.status(400);
    throw new Error("Jetski not found");
  }

  // Check for admin
  if (!req.admin) {
    res.status(401);
    throw new Error("admin not found");
  }

  // Make sure the logged in Admin matches
  if (jetski.admin.toString() !== req.admin.id) {
    res.status(401);
    throw new Error("Admin not authorized");
  }

  const updateJetski = await Jetski.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updateJetski);
});

// @desc    Delete goal
// @route   DELETE /api/jetski/:id
// @access  Private
const deleteJetski = asyncHandler(async (req, res) => {
  const jetski = await Jetski.findById(req.params.id);

  if (!jetski) {
    res.status(400);
    throw new Error("Jetski not found");
  }

  // Check for admin

  if (!req.admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  // Make sure the logged in is the admin
  if (goal.admin.toString() !== req.admin.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Jetski.deleteOne({ _id: req.params.id });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getJetskis,
  createJetski,
  updateJetski,
  deleteJetski,
  getJetInfo,
  generateSignedUrl,
};
