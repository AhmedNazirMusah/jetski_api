const express = require('express')
const router = express.Router()
const { getJetskis,setJetski,deleteJetski, updateJetski, getJetInfo } = require('../controllers/jetskiController')
const { guard, protect } = require('../middleware/authMiddleware')  

router.route('/').get(protect, getJetskis ).post(guard, setJetski)
router.route('/:id').put(guard, updateJetski).delete(guard, deleteJetski).get(getJetInfo)

module.exports = router