const express = require('express')
const router = express.Router()
const { getJetskis,setJetski,deleteJetski, updateJetski } = require('../controllers/jetskiController')
const { guard, protect } = require('../middleware/authMiddleware')  
const upload = require('../middleware/upload')
router.route('/').get(protect, getJetskis ).post(guard,upload.single('image'), setJetski)
router.route('/:id').put(guard, updateJetski).delete(guard, deleteJetski)

module.exports = router