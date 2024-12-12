const express = require('express')
const router = express.Router()
const { getJetskis,createJetski,deleteJetski, updateJetski, getJetInfo } = require('../controllers/jetskiController')
const { guard, protect } = require('../middleware/authMiddleware')  
const upload = require('../config/multerConfig');

router.route('/').get( protect, getJetskis ).post(guard, upload.single('file'), createJetski);
router.route('/:id').put( guard, upload.single('file'), updateJetski).delete(guard, deleteJetski).get(getJetInfo)

module.exports = router
