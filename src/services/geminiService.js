const { GoogleGenerativeAI } = require('@google/generative-ai')

const generateResponse = async (chatHistory, newMessage, instruction = '') => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: instruction
        ? { parts: [{ text: instruction }] }
        : undefined,
    })

    const history = chatHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2048,
      },
    })

    const result = await chat.sendMessage(newMessage)
    const response = result.response

    if (!response || !response.candidates || !response.candidates.length) {
      throw new Error('No response from AI')
    }

    return response.text()
  } catch (error) {
    console.error('Gemini Service Error:', error)

    if (
      error.message.includes('API key') ||
      error.message.includes('API_KEY')
    ) {
      throw new Error('Invalid or missing API Key')
    }

    throw new Error(error.message || 'Failed to generate response from AI')
  }
}

module.exports = { generateResponse }
