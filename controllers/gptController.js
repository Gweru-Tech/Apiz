const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Store conversation history (in production, use Redis or database)
const conversations = new Map();

exports.chatWithGPT = async (req, res, next) => {
  try {
    const { message, conversationId, model = 'gpt-3.5-turbo', maxTokens = 1000 } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured'
      });
    }

    // Get or create conversation history
    const convId = conversationId || Date.now().toString();
    let history = conversations.get(convId) || [];

    // Add user message to history
    history.push({
      role: 'user',
      content: message
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: history,
      max_tokens: maxTokens,
      temperature: 0.7
    });

    const assistantMessage = completion.choices[0].message.content;

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: assistantMessage
    });

    // Store updated history (limit to last 10 messages)
    if (history.length > 10) {
      history = history.slice(-10);
    }
    conversations.set(convId, history);

    res.json({
      success: true,
      data: {
        conversationId: convId,
        message: assistantMessage,
        model: model,
        tokensUsed: completion.usage.total_tokens
      }
    });

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.error.message
      });
    }
    next(error);
  }
};

// Clear conversation history
exports.clearConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required'
      });
    }

    conversations.delete(conversationId);

    res.json({
      success: true,
      message: 'Conversation cleared successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Get conversation history
exports.getConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required'
      });
    }

    const history = conversations.get(conversationId) || [];

    res.json({
      success: true,
      data: {
        conversationId,
        messages: history,
        count: history.length
      }
    });

  } catch (error) {
    next(error);
  }
};
