const axios = require('axios');
const { handleError, validateRequiredParams } = require('../utils/helper');

const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi'
};

exports.translateText = async (req, res) => {
  try {
    const { text, from = 'auto', to = 'en' } = req.body;
    
    const validation = validateRequiredParams({ text, to }, ['text', 'to']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Using Google Translate API (unofficial) or LibreTranslate
    const response = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: from,
      target: to,
      format: 'text'
    });

    res.json({
      success: true,
      data: {
        original: text,
        translated: response.data.translatedText,
        from: from === 'auto' ? response.data.detectedLanguage?.language : from,
        to: to
      }
    });
  } catch (error) {
    handleError(res, error, 'Translation failed');
  }
};

exports.getSupportedLanguages = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        languages: SUPPORTED_LANGUAGES,
        total: Object.keys(SUPPORTED_LANGUAGES).length
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch languages');
  }
};

exports.detectLanguage = async (req, res) => {
  try {
    const { text } = req.body;
    
    const validation = validateRequiredParams({ text }, ['text']);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const response = await axios.post('https://libretranslate.com/detect', {
      q: text
    });

    res.json({
      success: true,
      data: {
        text,
        detected_language: response.data[0].language,
        confidence: response.data[0].confidence
      }
    });
  } catch (error) {
    handleError(res, error, 'Language detection failed');
  }
};
