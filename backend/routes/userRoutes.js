import express from 'express'
import { protect } from '../middleware/authMiddleWare.js'
import {
  authenticateUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/userControllers.js'

const router = express.Router()

router.post('/', registerUser)
router.post('/auth', authenticateUser)
router.post('/logout', logoutUser)
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)

export default router