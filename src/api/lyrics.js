const axios = require('axios');

module.exports = (app) => {
    // Mock lyrics database for demonstration
    const lyricsDatabase = [
        {
            id: 'lyrics_001',
            title: 'Amazing Grace',
            artist: 'John Newton',
            album: 'Hymns Collection',
            genre: 'Gospel',
            year: 1779,
            language: 'en',
            lyrics: `Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see

'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed

Through many dangers, toils, and snares
I have already come
'Tis grace has brought me safe thus far
And grace will lead me home`,
            metadata: {
                duration: '3:45',
                bpm: 72,
                key: 'F Major',
                writer: 'John Newton',
                composer: 'Traditional',
                copyright: 'Public Domain'
            }
        },
        {
            id: 'lyrics_002',
            title: 'Neria',
            artist: 'Oliver Mtukudzi',
            album: 'Neria',
            genre: 'Afro-Jazz',
            year: 1993,
            language: 'sn',
            lyrics: `Neria, Neria
Baba vangu vauya ari kure
Neria, Neria
Baba vangu vauya ari kure

Tiri kudarika zvatakasara
Tiri kudarika zvatakasara
Neria, Neria
Baba vangu vauya ari kure

Mazuva acho takakurira
Takatarisana takakumbirwa
Neria, Neria
Baba vangu vauya ari kure`,
            metadata: {
                duration: '4:12',
                bpm: 84,
                key: 'C Major',
                writer: 'Oliver Mtukudzi',
                composer: 'Oliver Mtukudzi',
                copyright: 'Tuku Music'
            }
        },
        {
            id: 'lyrics_003',
            title: 'Shape of You',
            artist: 'Ed Sheeran',
            album: '÷ (Divide)',
            genre: 'Pop',
            year: 2017,
            language: 'en',
            lyrics: `The club isn't the best place to find a lover
So the bar is where I go
Me and my friends at the table doing shots
Drinking fast and then we talk slow
Come over and start up a conversation with just me
And trust me I'll give it a chance now
Take my hand, stop, put Van the Man on the jukebox
And then we start to dance
And now I'm singing like
Girl, you know I want your love
Your love was handmade for somebody like me
Come on now, follow my lead
I may be crazy, don't mind me
Say, boy, let's not talk too much
Grab on my waist and put that body on me
Come on now, follow my lead
Come, come on now, follow my lead

I'm in love with the shape of you
We push and pull like a magnet do
Although my heart is falling too
I'm in love with your body

And last night you were in my room
And now my bedsheets smell like you
Every day discovering something brand new
I'm in love with your body`,
            metadata: {
                duration: '3:53',
                bpm: 96,
                key: 'C# Minor',
                writer: 'Ed Sheeran, Steve Mac, Johnny McDaid',
                composer: 'Ed Sheeran, Steve Mac, Johnny McDaid',
                copyright: 'Atlantic Records'
            }
        }
    ];

    // Search for lyrics
    app.get('/api/lyrics/search', (req, res) => {
        try {
            const { 
                query, 
                artist, 
                title, 
                genre, 
                language, 
                year,
                limit = 10 
            } = req.query;

            let results = [...lyricsDatabase];

            // Filter by search query
            if (query) {
                const searchTerm = query.toLowerCase();
                results = results.filter(song => 
                    song.title.toLowerCase().includes(searchTerm) ||
                    song.artist.toLowerCase().includes(searchTerm) ||
                    song.lyrics.toLowerCase().includes(searchTerm)
                );
            }

            // Filter by artist
            if (artist) {
                results = results.filter(song => 
                    song.artist.toLowerCase().includes(artist.toLowerCase())
                );
            }

            // Filter by title
            if (title) {
                results = results.filter(song => 
                    song.title.toLowerCase().includes(title.toLowerCase())
                );
            }

            // Filter by genre
            if (genre) {
                results = results.filter(song => 
                    song.genre.toLowerCase().includes(genre.toLowerCase())
                );
            }

            // Filter by language
            if (language) {
                results = results.filter(song => song.language === language);
            }

            // Filter by year
            if (year) {
                results = results.filter(song => song.year.toString() === year);
            }

            const limitedResults = results.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Found ${results.length} songs matching your criteria`,
                data: {
                    songs: limitedResults.map(song => ({
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        album: song.album,
                        genre: song.genre,
                        year: song.year,
                        language: song.language,
                        duration: song.metadata.duration,
                        preview: song.lyrics.substring(0, 100) + '...'
                    })),
                    totalResults: results.length,
                    searchCriteria: {
                        query, artist, title, genre, language, year, limit
                    }
                }
            });
        } catch (error) {
            console.error('Lyrics search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Lyrics search failed',
                error: error.message
            });
        }
    });

    // Get full lyrics for a specific song
    app.get('/api/lyrics/:songId', (req, res) => {
        try {
            const { songId, format = 'text' } = req.params;
            
            const song = lyricsDatabase.find(s => s.id === songId);
            
            if (!song) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Song not found'
                });
            }

            let formattedLyrics = song.lyrics;
            
            // Format lyrics based on requested format
            if (format === 'lines') {
                formattedLyrics = song.lyrics.split('\n').map((line, index) => ({
                    line: index + 1,
                    text: line.trim(),
                    timestamp: Math.floor(index * 3) // Mock timestamp in seconds
                }));
            } else if (format === 'synced') {
                formattedLyrics = song.lyrics.split('\n').map((line, index) => ({
                    time: formatTime(Math.floor(index * 3)),
                    text: line.trim()
                }));
            }

            const response = {
                song: {
                    id: song.id,
                    title: song.title,
                    artist: song.artist,
                    album: song.album,
                    genre: song.genre,
                    year: song.year,
                    language: song.language,
                    metadata: song.metadata
                },
                lyrics: formattedLyrics,
                copyright: song.metadata.copyright,
                disclaimer: 'This content is for educational purposes only. All rights belong to the original copyright holders.'
            };

            res.json({
                status: 'success',
                message: 'Lyrics retrieved successfully',
                data: response
            });
        } catch (error) {
            console.error('Lyrics retrieval error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve lyrics',
                error: error.message
            });
        }
    });

    // Get lyrics by artist
    app.get('/api/lyrics/artist/:artistName', (req, res) => {
        try {
            const { artistName } = req.params;
            const { limit = 10, sortBy = 'year' } = req.query;
            
            const artistSongs = lyricsDatabase.filter(song => 
                song.artist.toLowerCase().includes(artistName.toLowerCase())
            );

            // Sort results
            if (sortBy === 'year') {
                artistSongs.sort((a, b) => b.year - a.year);
            } else if (sortBy === 'title') {
                artistSongs.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortBy === 'album') {
                artistSongs.sort((a, b) => a.album.localeCompare(b.album));
            }

            const limitedResults = artistSongs.slice(0, Math.min(parseInt(limit), 50));

            // Calculate artist statistics
            const artistStats = {
                totalSongs: artistSongs.length,
                totalAlbums: new Set(artistSongs.map(s => s.album)).size,
                genres: [...new Set(artistSongs.map(s => s.genre))],
                yearRange: {
                    earliest: Math.min(...artistSongs.map(s => s.year)),
                    latest: Math.max(...artistSongs.map(s => s.year))
                },
                languages: [...new Set(artistSongs.map(s => s.language))]
            };

            res.json({
                status: 'success',
                message: `Found ${artistSongs.length} songs by ${artistName}`,
                data: {
                    artist: artistName,
                    statistics: artistStats,
                    songs: limitedResults.map(song => ({
                        id: song.id,
                        title: song.title,
                        album: song.album,
                        genre: song.genre,
                        year: song.year,
                        language: song.language,
                        duration: song.metadata.duration
                    }))
                }
            });
        } catch (error) {
            console.error('Artist lyrics error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve artist songs',
                error: error.message
            });
        }
    });

    // Translate lyrics
    app.post('/api/lyrics/translate', (req, res) => {
        try {
            const { songId, targetLanguage, format = 'text' } = req.body;
            
            if (!songId || !targetLanguage) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Song ID and target language are required'
                });
            }

            const song = lyricsDatabase.find(s => s.id === songId);
            
            if (!song) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Song not found'
                });
            }

            // Mock translation
            const translations = {
                'en-sn': {
                    'Amazing grace, how sweet the sound': 'Zvakanakisa rudo, rinoita sei rinoita',
                    'That saved a wretch like me': 'Zvakaponesa muranda waitikana saizvi',
                    'I once was lost, but now am found': 'Zvaisaziva kuti ndakarasika, asi zvino ndawana',
                    'Was blind, but now I see': 'Zvaisaziva kuti ndanga chipwere, asi zvino ndiona'
                },
                'sn-en': {
                    'Neria, Neria': 'Neria, Neria',
                    'Baba vangu vauya ari kure': 'My father came from afar',
                    'Tiri kudarika zvatakasara': 'We miss what we left behind',
                    'Mazuva acho takakurira': 'In those days we grew up'
                }
            };

            const translationKey = `${song.language}-${targetLanguage}`;
            const translatedLines = [];

            const lines = song.lyrics.split('\n');
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (translations[translationKey] && translations[translationKey][trimmedLine]) {
                    translatedLines.push(translations[translationKey][trimmedLine]);
                } else {
                    // Mock translation for demonstration
                    translatedLines.push(`[${targetLanguage.toUpperCase()}] ${trimmedLine}`);
                }
            }

            const translatedLyrics = format === 'lines' ? 
                translatedLines.map((line, index) => ({
                    line: index + 1,
                    original: lines[index].trim(),
                    translated: line,
                    timestamp: Math.floor(index * 3)
                })) : 
                translatedLines.join('\n');

            res.json({
                status: 'success',
                message: 'Lyrics translated successfully',
                data: {
                    originalSong: {
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        language: song.language
                    },
                    translation: {
                        targetLanguage: targetLanguage,
                        lyrics: translatedLyrics,
                        format: format
                    },
                    note: 'This is a mock translation. In production, integrate with professional translation services.'
                }
            });
        } catch (error) {
            console.error('Lyrics translation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Lyrics translation failed',
                error: error.message
            });
        }
    });

    // Get synchronized lyrics with timestamps
    app.get('/api/lyrics/:songId/sync', (req, res) => {
        try {
            const { songId, precision = 'word' } = req.params;
            
            const song = lyricsDatabase.find(s => s.id === songId);
            
            if (!song) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Song not found'
                });
            }

            const lines = song.lyrics.split('\n').filter(line => line.trim());
            let syncedLyrics = [];

            if (precision === 'line') {
                // Line-level synchronization
                syncedLyrics = lines.map((line, index) => ({
                    time: formatTime(index * 5),
                    duration: '5s',
                    text: line.trim()
                }));
            } else if (precision === 'word') {
                // Word-level synchronization (more detailed)
                let currentTime = 0;
                lines.forEach(line => {
                    const words = line.trim().split(' ');
                    words.forEach(word => {
                        syncedLyrics.push({
                            time: formatTime(currentTime),
                            duration: '0.5s',
                            text: word,
                            type: 'word'
                        });
                        currentTime += 0.5;
                    });
                    syncedLyrics.push({
                        time: formatTime(currentTime),
                        duration: '1s',
                        text: '\n',
                        type: 'line_break'
                    });
                    currentTime += 1;
                });
            }

            res.json({
                status: 'success',
                message: 'Synchronized lyrics retrieved successfully',
                data: {
                    song: {
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        duration: song.metadata.duration
                    },
                    synchronization: {
                        precision: precision,
                        totalLines: lines.length,
                        totalWords: song.lyrics.split(' ').length,
                        lyrics: syncedLyrics
                    }
                }
            });
        } catch (error) {
            console.error('Synced lyrics error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve synchronized lyrics',
                error: error.message
            });
        }
    });

    // Get lyrics analysis and insights
    app.get('/api/lyrics/:songId/analysis', (req, res) => {
        try {
            const { songId } = req.params;
            
            const song = lyricsDatabase.find(s => s.id === songId);
            
            if (!song) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Song not found'
                });
            }

            const words = song.lyrics.split(/\s+/).filter(word => word.trim());
            const sentences = song.lyrics.split(/[.!?]+/).filter(s => s.trim());
            const lines = song.lyrics.split('\n').filter(line => line.trim());

            // Perform basic text analysis
            const wordFrequency = {};
            words.forEach(word => {
                const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
                wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
            });

            const sortedWords = Object.entries(wordFrequency)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            // Sentiment analysis (mock)
            const positiveWords = ['love', 'grace', 'sweet', 'amazing', 'wonderful', 'beautiful', 'happy', 'joy'];
            const negativeWords = ['lost', 'blind', 'wretch', 'fear', 'dangers', 'toils', 'snares'];
            
            const positiveCount = words.filter(word => 
                positiveWords.includes(word.toLowerCase().replace(/[.,!?;:]/g, ''))
            ).length;
            
            const negativeCount = words.filter(word => 
                negativeWords.includes(word.toLowerCase().replace(/[.,!?;:]/g, ''))
            ).length;

            const sentiment = positiveCount > negativeCount ? 'positive' : 
                             negativeCount > positiveCount ? 'negative' : 'neutral';

            const analysis = {
                song: {
                    id: song.id,
                    title: song.title,
                    artist: song.artist,
                    language: song.language
                },
                textMetrics: {
                    wordCount: words.length,
                    characterCount: song.lyrics.length,
                    lineCount: lines.length,
                    sentenceCount: sentences.length,
                    averageWordsPerLine: Math.round(words.length / lines.length * 10) / 10,
                    averageCharactersPerWord: Math.round(song.lyrics.length / words.length * 10) / 10
                },
                vocabulary: {
                    uniqueWords: Object.keys(wordFrequency).length,
                    vocabularyDiversity: ((Object.keys(wordFrequency).length / words.length) * 100).toFixed(1) + '%',
                    mostFrequentWords: sortedWords.map(([word, count]) => ({ word, count })),
                    averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length
                },
                sentiment: {
                    overall: sentiment,
                    positiveWords: positiveCount,
                    negativeWords: negativeCount,
                    neutralWords: words.length - positiveCount - negativeCount,
                    confidence: Math.abs(positiveCount - negativeCount) / words.length * 100
                },
                structure: {
                    rhymeScheme: detectRhymeScheme(lines),
                    repetitionAnalysis: detectRepetition(lines),
                    themes: extractThemes(words)
                },
                readability: {
                    fleschScore: Math.floor(Math.random() * 50) + 50, // Mock score
                    readingLevel: 'Intermediate',
                    estimatedReadingTime: Math.ceil(words.length / 200) + ' seconds'
                }
            };

            res.json({
                status: 'success',
                message: 'Lyrics analysis completed successfully',
                data: analysis,
                note: 'This is basic text analysis. In production, use advanced NLP tools for deeper insights.'
            });
        } catch (error) {
            console.error('Lyrics analysis error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Lyrics analysis failed',
                error: error.message
            });
        }
    });

    // Search lyrics by specific phrase or line
    app.get('/api/lyrics/phrase-search', (req, res) => {
        try {
            const { phrase, exactMatch = false, limit = 10 } = req.query;
            
            if (!phrase) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Search phrase is required'
                });
            }

            const results = [];
            const searchPhrase = phrase.toLowerCase();

            lyricsDatabase.forEach(song => {
                const lines = song.lyrics.split('\n');
                lines.forEach((line, lineIndex) => {
                    const cleanLine = line.toLowerCase().trim();
                    
                    const matches = exactMatch ? 
                        cleanLine === searchPhrase :
                        cleanLine.includes(searchPhrase);

                    if (matches) {
                        results.push({
                            songId: song.id,
                            title: song.title,
                            artist: song.artist,
                            album: song.album,
                            line: line.trim(),
                            lineNumber: lineIndex + 1,
                            context: getLineContext(lines, lineIndex, 2),
                            matchType: exactMatch ? 'exact' : 'partial'
                        });
                    }
                });
            });

            const limitedResults = results.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Found ${results.length} occurrences of "${phrase}"`,
                data: {
                    phrase: phrase,
                    exactMatch: exactMatch === 'true',
                    occurrences: limitedResults,
                    totalResults: results.length
                }
            });
        } catch (error) {
            console.error('Phrase search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Phrase search failed',
                error: error.message
            });
        }
    });
};

// Helper functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function detectRhymeScheme(lines) {
    // Simple rhyme detection (mock implementation)
    const rhymeMap = {};
    const scheme = [];
    let rhymeIndex = 0;

    lines.forEach((line, index) => {
        const words = line.trim().split(' ');
        const lastWord = words[words.length - 1].toLowerCase().replace(/[.,!?;:]/g, '');
        
        // Simple rhyming check (mock)
        const rhymePattern = lastWord.substring(lastWord.length - 2);
        
        if (rhymeMap[rhymePattern]) {
            scheme.push(rhymeMap[rhymePattern]);
        } else {
            const letter = String.fromCharCode(65 + rhymeIndex); // A, B, C, etc.
            rhymeMap[rhymePattern] = letter;
            scheme.push(letter);
            rhymeIndex++;
        }
    });

    return scheme.join('');
}

function detectRepetition(lines) {
    const repeatedLines = [];
    const lineCount = {};
    
    lines.forEach(line => {
        const cleanLine = line.trim();
        lineCount[cleanLine] = (lineCount[cleanLine] || 0) + 1;
    });

    for (const [line, count] of Object.entries(lineCount)) {
        if (count > 1) {
            repeatedLines.push({ line, count });
        }
    }

    return repeatedLines;
}

function extractThemes(words) {
    const themeKeywords = {
        'Love': ['love', 'heart', 'romance', 'kiss', 'emotion'],
        'Religion': ['god', 'grace', 'heaven', 'pray', 'faith'],
        'Life': ['life', 'live', 'born', 'grow', 'journey'],
        'Nature': ['sun', 'moon', 'stars', 'sky', 'earth'],
        'Time': ['time', 'day', 'night', 'forever', 'moment']
    };

    const themes = {};
    const cleanWords = words.map(word => word.toLowerCase().replace(/[.,!?;:]/g, ''));

    for (const [theme, keywords] of Object.entries(themeKeywords)) {
        let count = 0;
        keywords.forEach(keyword => {
            count += cleanWords.filter(word => word.includes(keyword)).length;
        });
        if (count > 0) {
            themes[theme] = count;
        }
    }

    return themes;
}

function getLineContext(lines, targetIndex, contextLines) {
    const start = Math.max(0, targetIndex - contextLines);
    const end = Math.min(lines.length, targetIndex + contextLines + 1);
    
    return {
        before: lines.slice(start, targetIndex).map(line => line.trim()),
        after: lines.slice(targetIndex + 1, end).map(line => line.trim()),
        full: lines.slice(start, end).map((line, index) => ({
            line: line.trim(),
            isTarget: start + index === targetIndex
        }))
    };
}