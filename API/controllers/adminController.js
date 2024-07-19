const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/adminModel')

// @desc    Register new admin
// @route   POST /api/admin
// @access  Private

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400)
    throw new Error('Please add all fields')
  }

      // Check if the requesting user is a super admin
      if (req.admin.role !== 'superadmin') {
        res.status(403);
        throw new Error('Only super admins can create new admins');
    }

  // Check if Admin exists
  const adminExists = await Admin.findOne({ email })

  if (adminExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create Admin
  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role: role,
});

if (admin) {
  res.status(201).json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
  });
} else {
  res.status(400);
  throw new Error('Invalid admin data');
}
});

// @desc    Authenticate an Admin
// @route   POST /api/admin/login
// @access  private
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const admin = await Admin.findOne({ email })

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
    });
} else {
    res.status(400);
    throw new Error('Invalid credentials');
}
});


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

module.exports = {
  registerAdmin,
  loginAdmin,
}