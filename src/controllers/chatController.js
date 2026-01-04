const Chat = require('../models/Chat')
const { validationResult } = require('express-validator')
const { generateResponse } = require('../services/aiService')

// @desc    Get all chats for the user (only _id and title)
// @route   GET /api/chats
// @access  Private
exports.getChats = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const chats = await Chat.find({ userId: req.user.id })
      .select('_id title updatedAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Chat.countDocuments({ userId: req.user.id })

    res.json({
      chats,
      page,
      pages: Math.ceil(total / limit),
      total,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create a new chat
// @route   POST /api/chats
// @access  Private
exports.createChat = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title = 'Новый чат', instruction = '' } = req.body

  try {
    const chat = new Chat({
      title,
      instruction,
      userId: req.user.id,
    })

    await chat.save()

    res.status(201).json(chat)
  } catch (err) {
    next(err)
  }
}

// @desc    Get a single chat by ID
// @route   GET /api/chats/:id
// @access  Private
exports.getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    if (chat.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    res.json(chat)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Chat not found' })
    }
    next(err)
  }
}

// @desc    Add a message to a chat
// @route   POST /api/chats/:id/messages
// @access  Private
exports.addMessage = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { content } = req.body

  try {
    const chat = await Chat.findById(req.params.id)

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    if (chat.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Pass historical messages and new content
    const aiResponseText = await generateResponse(chat.messages, content, chat.instruction)

    // Save user message
    chat.messages.push({ role: 'user', content })
    // Save assistant message
    chat.messages.push({ role: 'assistant', content: aiResponseText })

    await chat.save()

    res.json(chat)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Chat not found' })
    }
    next(err)
  }
}

// @desc    Update chat title or instruction
// @route   PATCH /api/chats/:id
// @access  Private
exports.updateChat = async (req, res, next) => {
  const { title, instruction } = req.body

  try {
    const chat = await Chat.findById(req.params.id)

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    if (chat.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    if (title) chat.title = title
    if (instruction !== undefined) chat.instruction = instruction

    await chat.save()

    res.json(chat)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Chat not found' })
    }
    next(err)
  }
}

// @desc    Delete a chat
// @route   DELETE /api/chats/:id
// @access  Private
exports.deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    if (chat.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await chat.deleteOne()

    res.json({ message: 'Chat deleted' })
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Chat not found' })
    }
    next(err)
  }
}
