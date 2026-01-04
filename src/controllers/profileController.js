const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// @desc    Update user profile
// @route   PUT /api/profile/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, email } = req.body

  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (username) user.username = username
    if (email) user.email = email

    await user.save()

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Change password
// @route   PUT /api/profile/changepassword
// @access  Private
exports.changePassword = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { currentPassword, newPassword } = req.body

  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    next(err)
  }
}
