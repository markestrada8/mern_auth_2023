import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Query User
  const user = await User.findOne({ email })

  // If User exists, generate jwt and send back with response
  // bcrypt compare method added to user model
  if (user && await user.matchPasswords(password)) {
    generateToken(res, user._id)
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }


})

// @desc Register new user
// route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Query User and error
  const userExists = await User.findOne({ email: email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Write new User
  const user = await User.create({ name, email, password })

  // Upon success, generate new token and return with response
  if (user) {
    generateToken(res, user._id)
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc Logout user
// route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  // Wipe cookie from returning response object...
  res.cookie('user_token', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: 'User logged out.' })
})

// @desc Get user profile
// route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email
  }
  res.status(200).json(user)
})

// @desc Update user profile
// route PUT /api/users
// @access Public
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
  res.status(200).json({ message: 'Update user profile' })
})

export {
  authenticateUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
}

