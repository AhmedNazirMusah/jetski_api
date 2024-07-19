const express = require('express')
const router = express.Router()
const { registerAdmin , loginAdmin } = require('../controllers/adminController') 
const { requireSuperAdmin, guard } = require('../middleware/authMiddleware')


router.post('/register',guard, requireSuperAdmin,  registerAdmin)
router.post('/login', loginAdmin)

module.exports = router