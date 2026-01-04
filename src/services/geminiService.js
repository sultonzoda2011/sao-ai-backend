const fetch = require('node-fetch');

const generateResponse = async (chatHistory, newMessage, instruction = '') => {
  try {
    const text = `${instruction ? instruction + '\n' : ''}${chatHistory.map(m => m.content).join('\n')}\n${newMessage}`;

    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HF_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: text }),
    });

    const data = await response.json();
    return data[0]?.generated_text || '';
  } catch (error) {
    console.error('Hugging Face Error:', error);
    throw new Error(error.message || 'Failed to generate response');
  }
};

module.exports = { generateResponse };
