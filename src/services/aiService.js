const fetch = require('node-fetch');

const generateResponse = async (chatHistory, newMessage, instruction = '') => {
  try {
    // Проверяем наличие API ключа
    if (!process.env.HF_API_KEY) {
      throw new Error('HF_API_KEY не установлен в переменных окружения');
    }

    const text = `${instruction ? instruction + '\n' : ''}${chatHistory.map(m => m.content).join('\n')}\n${newMessage}`;

    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HF_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: text }),
    });

    // Проверяем статус ответа
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401 || errorData.error?.includes('api key')) {
        throw new Error('Неверный или отсутствующий API ключ Hugging Face');
      }
      throw new Error(`Ошибка API: ${response.status} - ${errorData.error || 'Неизвестная ошибка'}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || '';
  } catch (error) {
    console.error('Hugging Face Error:', error);
    throw new Error(error.message || 'Failed to generate response');
  }
};

module.exports = { generateResponse };
