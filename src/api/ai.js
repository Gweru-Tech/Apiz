const axios = require('axios');

module.exports = (app) => {
    // AI Text Generation (Mock implementation - in production, connect to OpenAI/Anthropic)
    app.post('/api/ai/generate', async (req, res) => {
        try {
            const { prompt, language = 'en', maxTokens = 100, temperature = 0.7 } = req.body;
            
            if (!prompt) {
                return res.status(400).json({
                    status: 'error',
                    message: language === 'sn' ? 'Zvinyorwa zvinodiwa' : 'Prompt is required'
                });
            }

            // Mock AI response generation
            const mockResponses = {
                en: {
                    'hello': 'Hello! How can I assist you today? I\'m here to help with various tasks including text generation, translation, and analysis.',
                    'help': 'I can help you with text generation, translation, summarization, sentiment analysis, and multilingual support including English and Shona.',
                    'shona': 'Shona (ChiShona) is a Bantu language spoken by the Shona people primarily in Zimbabwe. It has approximately 10 million speakers.',
                    'default': 'This is a simulated AI response. In production, this would connect to real AI services like OpenAI GPT or Anthropic Claude.'
                },
                sn: {
                'mhoro': 'Mhoro! Ndingakubatsirei neyi? Ndiri pakubatsira zvakasiyana-siyana zvinosanganisira kuverenga zviridzwa, kushandurudzirwa, nekuongorora.',
                    'batsira': 'Ndingakubatsire nekugadzirisa mazwi, kushandurudzirwa, kuunganidza kukosha, kuongorora mafungiro, nekinsi kuwanda kwemitauro kunosanganisira ChiShona neChirungu.',
                    'ai': 'AI (Artificial Intelligence) kana Kuchenjeri Kwakakodzera, iyi ndiyo yekugadzirisa computer kuti isvike pamafungiro emunhu ayo anowanzoita basa rakakosha.',
                    'default': 'Iyi iyi mhando yeku imitation yeAI mhinduro. Mukugadzirisa, iyi yaizokwana nekushandisa zviservices zvinobva paAI zvakadaro seOpenAI kana Anthropic.'
                }
            };

            // Generate appropriate response
            let responseText = mockResponses[language]?.default || 
                              (language === 'sn' ? 'Pati tinotenda chimwechete chete.' : 'Thank you for your inquiry.');
            
            // Check for specific keywords
            const lowerPrompt = prompt.toLowerCase();
            for (const [key, value] of Object.entries(mockResponses[language] || {})) {
                if (lowerPrompt.includes(key)) {
                    responseText = value;
                    break;
                }
            }

            res.json({
                status: 'success',
                message: language === 'sn' ? 'Mhinduro yakabudirira' : 'Generation successful',
                data: {
                    prompt: prompt,
                    response: responseText,
                    language: language,
                    maxTokens: maxTokens,
                    temperature: temperature,
                    model: 'mock-ai-v1',
                    usage: {
                        promptTokens: Math.floor(prompt.length / 4),
                        completionTokens: Math.floor(responseText.length / 4),
                        totalTokens: Math.floor((prompt.length + responseText.length) / 4)
                    },
                    timestamp: new Date().toISOString(),
                    note: language === 'sn' ? 
                          'Iyi ndiyo mhando yeku imitation. Mukugadzirisa, izvi zvinoshandiswa zviservices zveAI zvine chokuita.' :
                          'This is a mock implementation. In production, connect to real AI services.'
                }
            });
        } catch (error) {
            console.error('AI generation error:', error);
            res.status(500).json({
                status: 'error',
                message: req.body.language === 'sn' ? 'Kukundikana kuAI' : 'AI generation failed',
                error: error.message
            });
        }
    });

    // AI Translation (English ↔ Shona and other languages)
    app.post('/api/ai/translate', async (req, res) => {
        try {
            const { text, fromLanguage, toLanguage } = req.body;
            
            if (!text || !fromLanguage || !toLanguage) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Text, fromLanguage, and toLanguage are required'
                });
            }

            // Mock translation dictionary for English ↔ Shona
            const translations = {
                'en-sn': {
                    'hello': 'mhoro',
                    'goodbye': 'farewell',
                    'thank you': 'nata',
                    'please': 'ngaibvise',
                    'yes': 'ehe',
                    'no': 'kwete',
                    'how are you': 'mari here',
                    'i am fine': 'ndiri fine',
                    'good morning': 'mangwanani akanaka',
                    'good evening': 'manheru akanaka',
                    'help': 'batsira',
                    'love': 'rudo',
                    'peace': 'runyararo',
                    'friend': 'shamwari',
                    'family': 'family',
                    'water': 'mvura',
                    'food': 'chokudya',
                    'home': 'imba'
                },
                'sn-en': {
                    'mhoro': 'hello',
                    'farewell': 'goodbye',
                    'nata': 'thank you',
                    'ngaibvise': 'please',
                    'ehe': 'yes',
                    'kwete': 'no',
                    'mari here': 'how are you',
                    'ndiri fine': 'i am fine',
                    'mangwanani akanaka': 'good morning',
                    'manheru akanaka': 'good evening',
                    'batsira': 'help',
                    'rudo': 'love',
                    'runyararo': 'peace',
                    'shamwari': 'friend',
                    'family': 'family',
                    'mvura': 'water',
                    'chokudya': 'food',
                    'imba': 'home'
                }
            };

            const translationKey = `${fromLanguage}-${toLanguage}`;
            let translatedText = text.toLowerCase();

            // Check if we have direct translation
            if (translations[translationKey]) {
                for (const [english, shona] of Object.entries(translations[translationKey])) {
                    translatedText = translatedText.replace(new RegExp(english, 'gi'), shona);
                }
            }

            // Fallback response if no translation found
            if (translatedText === text.toLowerCase()) {
                translatedText = `[${fromLanguage} → ${toLanguage}] ${text}`;
            }

            res.json({
                status: 'success',
                message: 'Translation completed successfully',
                data: {
                    originalText: text,
                    translatedText: translatedText,
                    fromLanguage: fromLanguage,
                    toLanguage: toLanguage,
                    confidence: 0.85,
                    alternatives: [
                        translatedText,
                        text.includes('hello') ? (toLanguage === 'sn' ? 'mhoro' : 'hello') : null,
                        text.includes('thank') ? (toLanguage === 'sn' ? 'nata' : 'thank you') : null
                    ].filter(Boolean),
                    timestamp: new Date().toISOString(),
                    note: 'This is a mock translation. In production, integrate with Google Translate API or similar services.'
                }
            });
        } catch (error) {
            console.error('Translation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Translation failed',
                error: error.message
            });
        }
    });

    // AI Sentiment Analysis
    app.post('/api/ai/sentiment', async (req, res) => {
        try {
            const { text, language = 'en' } = req.body;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: language === 'sn' ? 'Zvinyorwa zvinodiwa' : 'Text is required'
                });
            }

            // Simple sentiment analysis based on keywords
            const positiveWords = {
                en: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy', 'perfect'],
                sn: ['akanaka', 'zvakanaka', 'mupfumi', 'zvakanakisisa', 'rudo', 'furaya', 'shamwari', 'runyararo']
            };

            const negativeWords = {
                en: ['bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry', 'disappointed', 'poor'],
                sn: ['chiri chivi', 'chakaipa', 'kurwadziwa', 'tsvina', 'sara', 'zvivi', 'chakaipa']
            };

            const lowerText = text.toLowerCase();
            let positiveScore = 0;
            let negativeScore = 0;

            // Count positive and negative words
            (positiveWords[language] || []).forEach(word => {
                if (lowerText.includes(word)) positiveScore++;
            });

            (negativeWords[language] || []).forEach(word => {
                if (lowerText.includes(word)) negativeScore++;
            });

            // Determine sentiment
            let sentiment = 'neutral';
            let confidence = 0.5;
            
            if (positiveScore > negativeScore) {
                sentiment = 'positive';
                confidence = Math.min(0.5 + (positiveScore - negativeScore) * 0.1, 0.95);
            } else if (negativeScore > positiveScore) {
                sentiment = 'negative';
                confidence = Math.min(0.5 + (negativeScore - positiveScore) * 0.1, 0.95);
            }

            const sentimentLabels = {
                'positive': language === 'sn' ? 'Zvakanaka' : 'Positive',
                'negative': language === 'sn' ? 'Zvakaipa' : 'Negative',
                'neutral': language === 'sn' ? 'Pasina kuramisa' : 'Neutral'
            };

            res.json({
                status: 'success',
                message: 'Sentiment analysis completed',
                data: {
                    text: text,
                    sentiment: sentiment,
                    sentimentLabel: sentimentLabels[sentiment],
                    confidence: confidence,
                    scores: {
                        positive: positiveScore,
                        negative: negativeScore,
                        neutral: Math.max(0, 1 - positiveScore - negativeScore)
                    },
                    language: language,
                    wordCount: text.split(/\s+/).length,
                    timestamp: new Date().toISOString(),
                    note: 'This is basic sentiment analysis. In production, use advanced NLP models.'
                }
            });
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Sentiment analysis failed',
                error: error.message
            });
        }
    });

    // AI Text Summarization
    app.post('/api/ai/summarize', async (req, res) => {
        try {
            const { text, language = 'en', maxLength = 100, style = 'paragraph' } = req.body;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: language === 'sn' ? 'Zvinyorwa zvinodiwa' : 'Text is required'
                });
            }

            // Extractive summarization - pick key sentences
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            
            // Simple algorithm: pick first, middle, and last sentences
            let summarySentences = [];
            if (sentences.length > 0) {
                summarySentences.push(sentences[0].trim());
            }
            if (sentences.length > 2) {
                summarySentences.push(sentences[Math.floor(sentences.length / 2)].trim());
            }
            if (sentences.length > 1) {
                summarySentences.push(sentences[sentences.length - 1].trim());
            }

            let summary = summarySentences.join('. ');
            
            // Truncate if too long
            if (summary.length > maxLength) {
                summary = summary.substring(0, maxLength) + '...';
            }

            const summaryStyle = style === 'bullet' ? 
                summarySentences.map(s => `• ${s}`).join('\n') : summary;

            const messages = {
                en: {
                    summary: 'Summary generated successfully',
                    note: 'This is extractive summarization. In production, use abstractive AI models for better results.'
                },
                sn: {
                    summary: 'Zviwanikwa zvakabudirira',
                    note: 'Iyi extraction summarization. Mukugadzirisa, shandisa maAI anotaura kuti uwane mabasa aka better.'
                }
            };

            res.json({
                status: 'success',
                message: messages[language]?.summary || 'Summary generated successfully',
                data: {
                    originalText: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
                    summary: summaryStyle,
                    originalLength: text.length,
                    summaryLength: summaryStyle.length,
                    compressionRatio: ((text.length - summaryStyle.length) / text.length * 100).toFixed(1) + '%',
                    sentencesExtracted: summarySentences.length,
                    totalSentences: sentences.length,
                    language: language,
                    style: style,
                    timestamp: new Date().toISOString(),
                    note: messages[language]?.note || 'Summary generated using extractive methods'
                }
            });
        } catch (error) {
            console.error('Summarization error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Summarization failed',
                error: error.message
            });
        }
    });

    // AI Language Detection
    app.post('/api/ai/detect-language', async (req, res) => {
        try {
            const { text } = req.body;
            
            if (!text) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Text is required for language detection'
                });
            }

            // Simple language detection based on keywords
            const shonaKeywords = ['mhoro', 'zwino', 'ita', 'ita', 'kwazvo', 'zvirikuita', 'shamwari', 'rudo', 'runyararo'];
            const englishKeywords = ['hello', 'the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'this'];

            const lowerText = text.toLowerCase();
            let shonaScore = 0;
            let englishScore = 0;

            shonaKeywords.forEach(word => {
                if (lowerText.includes(word)) shonaScore++;
            });

            englishKeywords.forEach(word => {
                if (lowerText.includes(word)) englishScore++;
            });

            let detectedLanguage = 'unknown';
            let confidence = 0.5;
            
            if (shonaScore > englishScore) {
                detectedLanguage = 'sn';
                confidence = Math.min(0.6 + shonaScore * 0.1, 0.95);
            } else if (englishScore > shonaScore) {
                detectedLanguage = 'en';
                confidence = Math.min(0.6 + englishScore * 0.1, 0.95);
            }

            const languageInfo = {
                'en': { name: 'English', code: 'en', family: 'Indo-European' },
                'sn': { name: 'Shona (ChiShona)', code: 'sn', family: 'Bantu' },
                'unknown': { name: 'Unknown', code: 'unknown', family: 'Unknown' }
            };

            res.json({
                status: 'success',
                message: 'Language detection completed',
                data: {
                    text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                    detectedLanguage: detectedLanguage,
                    languageInfo: languageInfo[detectedLanguage],
                    confidence: confidence,
                    alternatives: [
                        { language: 'en', score: englishScore },
                        { language: 'sn', score: shonaScore }
                    ].sort((a, b) => b.score - a.score),
                    characterCount: text.length,
                    wordCount: text.split(/\s+/).length,
                    timestamp: new Date().toISOString(),
                    note: 'This is basic language detection. In production, use advanced NLP language detection models.'
                }
            });
        } catch (error) {
            console.error('Language detection error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Language detection failed',
                error: error.message
            });
        }
    });
};