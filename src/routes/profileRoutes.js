const express = require('express')
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController')
const { body } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
router.get('/', getProfile)

/**
 * @swagger
 * /api/profile/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put(
  '/update-profile',
  [
    body('username').optional().not().isEmpty().withMessage('Username cannot be empty'),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
  ],
  updateProfile
)

/**
 * @swagger
 * /api/profile/changepassword:
 *   put:
 *     summary: Change user password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password
 */
router.put(
  '/changepassword',
  [
    body('currentPassword', 'Current password is required').not().isEmpty(),
    body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  changePassword
)

module.exports = router
