const express = require('express')
const router = express.Router()
const { getJetskis,setJetski,deleteJetski, updateJetski } = require('../controllers/jetskiController')
const { guard } = require('../middleware/authMiddleware')  

router.route('/').get( getJetskis ).post(guard, setJetski)
router.route('/:id').put(guard, updateJetski).delete(guard, deleteJetski)

module.exports = router