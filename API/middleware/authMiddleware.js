const jwt = require('jsonwebtoken') 
const asyncHandler =  require('express-async-handler')
const User = require('../models/userModel')
const Admin = require('../models/adminModel')

const protect = asyncHandler(async (req,res, next) => {
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
    // Get token from bearer

    token = req.headers.authorization.split(' ')[1]

    // verify the token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    // get User from the token

    req.user = await User.findById(decoded.id).select('-password')
    next()
    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Not authorized')
    }
  }
  if(!token) {
    res.status(401) 
    throw new Error('not authorized no token')
  }

})

const guard = asyncHandler(async (req,res, next) => {
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
    // Get token from bearer

    token = req.headers.authorization.split(' ')[1]

    // verify the token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    // get Admin from the token

    req.admin = await Admin.findById(decoded.id).select('-password')
    next()
    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Not authorized')
    }
  }
  if(!token) {
    res.status(401) 
    throw new Error('not authorized no token')
  }
})

const requireSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'superadmin') {
      res.status(403);
      throw new Error('Access forbidden: requires superadmin role');
  }
  next();
};



module.exports = { protect, guard, requireSuperAdmin }