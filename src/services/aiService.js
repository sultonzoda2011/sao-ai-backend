// ====================== hfService.js ======================
// В Node.js 18+ fetch встроен, дополнительный импорт не нужен

/**
 * Генерация ответа через Hugging Face API
 * @param {Array} chatHistory - История сообщений [{ content: 'текст' }]
 * @param {string} newMessage - Новое сообщение пользователя
 * @param {string} instruction - Дополнительные инструкции для модели (опционально)
 * @returns {Promise<string>} - Сгенерированный текст модели
 */
const generateResponse = async (chatHistory, newMessage, instruction = '') => {
  try {
    // Проверяем наличие API ключа
    if (!process.env.HF_API_KEY) {
      throw new Error('HF_API_KEY не установлен в переменных окружения');
    }

    // Формируем текст для модели
    const text = `${instruction ? instruction + '\n' : ''}${chatHistory
      .map(m => m.content)
      .join('\n')}\n${newMessage}`;

    // Отправка запроса к Hugging Face Inference API (OpenAI совместимый)
    const response = await fetch('https://api-inference.huggingface.co/v1/models/gpt2/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: text,
        max_tokens: 100,
        temperature: 0.7
      }),
    });

    // Проверка ответа
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401 || errorData.error?.toLowerCase()?.includes('api key')) {
        throw new Error('Неверный или отсутствующий API ключ Hugging Face');
      }
      throw new Error(`Ошибка API: ${response.status} - ${errorData.error || 'Неизвестная ошибка'}`);
    }

    const data = await response.json();
    
    // Возвращаем сгенерированный текст (OpenAI формат)
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].text || '';
    }
    
    // Возвращаем пустую строку если нет ответа
    return '';
  } catch (error) {
    console.error('Hugging Face Error:', error.message);
    throw new Error(error.message || 'Failed to generate response');
  }
};

module.exports = { generateResponse };
