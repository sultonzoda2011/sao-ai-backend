const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const {
  getChats,
  createChat,
  getChatById,
  addMessage,
  updateChat,
  deleteChat,
} = require('../controllers/chatController');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chats for the user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of chats
 */
router.get('/', getChats);

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My awesome chat
 *               instruction:
 *                 type: string
 *                 example: You are a helpful assistant.
 *     responses:
 *       201:
 *         description: Created chat
 */
router.post(
  '/',
  [body('title').optional().isString(), body('instruction').optional().isString()],
  createChat
);

/**
 * @swagger
 * /api/chats/{id}:
 *   get:
 *     summary: Get a chat by ID
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full chat object
 *       404:
 *         description: Chat not found
 */
router.get('/:id', getChatById);

/**
 * @swagger
 * /api/chats/{id}/messages:
 *   post:
 *     summary: Add a message to a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Hello!
 *     responses:
 *       200:
 *         description: Updated chat with AI response
 */
router.post('/:id/messages', [body('content', 'Content is required').not().isEmpty()], addMessage);

/**
 * @swagger
 * /api/chats/{id}:
 *   patch:
 *     summary: Update chat title or instruction
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               instruction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated chat
 */
router.patch('/:id', updateChat);

/**
 * @swagger
 * /api/chats/{id}:
 *   delete:
 *     summary: Delete a chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat deleted
 */
router.delete('/:id', deleteChat);

module.exports = router;
