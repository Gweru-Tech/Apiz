const axios = require('axios');
const { handleError, validateRequiredParams } = require('../utils/helper');

exports.chat = async (req, res) => {
  try {
    const { prompt, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = req.body;
    
    const validation = validateRequiredParams({ prompt }, ['prompt']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.'
      });
    }

    // Call OpenAI API using axios
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    res.json({
      success: true,
      data: {
        response: response.data.choices[0].message.content,
        model: response.data.model,
        usage: {
          prompt_tokens: response.data.usage.prompt_tokens,
          completion_tokens: response.data.usage.completion_tokens,
          total_tokens: response.data.usage.total_tokens
        }
      }
    });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY.'
      });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'OpenAI API rate limit exceeded. Please try again later.'
      });
    }
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.response.data?.error?.message || 'Bad request to OpenAI API'
      });
    }
    handleError(res, error, 'GPT request failed');
  }
};
