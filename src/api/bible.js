module.exports = (app) => {
    // Mock Bible database with multiple translations
    const bibleData = {
        'en': {
            'kjv': {
                'john.3.16': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
                'gen.1.1': 'In the beginning God created the heaven and the earth.',
                'psalm.23.1': 'The LORD is my shepherd; I shall not want.',
                'matt.6.9': 'Our Father which art in heaven, Hallowed be thy name.',
                'acts.2.38': 'Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.'
            },
            'niv': {
                'john.3.16': 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
                'gen.1.1': 'In the beginning God created the heavens and the earth.',
                'psalm.23.1': 'The LORD is my shepherd, I lack nothing.',
                'matt.6.9': 'This, then, is how you should pray: "Our Father in heaven, hallowed be your name."',
                'acts.2.38': 'Peter replied, "Repent and be baptized, every one of you, in the name of Jesus Christ for the forgiveness of your sins. And you will receive the gift of the Holy Spirit."'
            }
        },
        'sn': {
            'bhaibheri': {
                'john.3.16': 'Chokwadi, Mwari akaenda rudo rwakakosha kuzvose zviyo, kwakazova kuti akapa Mwanakomana wake wega, chimwe chete, kuti ane tsitsi neMwari asingade kufa, asi ave nebumbiro reupenyu husingaperi.',
                'gen.1.1': 'Mukutanga Mwari akasika denga uye nyika.',
                'psalm.23.1': 'Jehovah ndimi shepherd yangu; handingadi chero zvaizvi.',
                'matt.6.9': 'Saka mutiudzei kuti: "Baba vedu vari mudenga, zita renyu rakaitwa takatwa."',
                'acts.2.38': 'Petro vakati, "Tendai naMwari, uye munobatizwa imwe neimwe yenyu muzita raJesu Kristi kurehwa zvipembedzo zvenyu, muchawana rubatsiro rweMweya Mutsvene."'
            }
        },
        'es': {
            'rvr': {
                'john.3.16': 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
                'gen.1.1': 'En el principio creó Dios los cielos y la tierra.',
                'psalm.23.1': 'Jehová es mi pastor; nada me faltará.',
                'matt.6.9': 'Vosotros, pues, oraréis así: Padre nuestro que estás en los cielos, santificado sea tu nombre.',
                'acts.2.38': 'Pedro les dijo: Arrepentíos, y bautícese cada uno de vosotros en el nombre de Jesucristo para perdón de los pecados, y recibiréis el don del Espíritu Santo.'
            }
        },
        'fr': {
            'lsg': {
                'john.3.16': 'Car Dieu a tant aimé le monde, qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.',
                'gen.1.1': 'Au commencement, Dieu créa les cieux et la terre.',
                'psalm.23.1': 'L\'Éternel est mon berger: je ne manquerai de rien.',
                'matt.6.9': 'Voici donc comment vous devez prier: Notre Père qui es aux cieux! Que ton nom soit sanctifié.',
                'acts.2.38': 'Pierre leur dit: Repentez-vous, et que chacun de vous soit baptisé au nom de Jésus-Christ, pour le pardon de vos péchés; et vous recevrez le don du Saint-Esprit.'
            }
        },
        'pt': {
            'nvi': {
                'john.3.16': 'Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.',
                'gen.1.1': 'No princípio Deus criou os céus e a terra.',
                'psalm.23.1': 'O Senhor é o meu pastor; de nada terei falta.',
                'matt.6.9': 'Vocês, orem assim: \'Pai nosso, que estás nos céus! Santificado seja o teu nome.',
                'acts.2.38': 'Pedro respondeu: "Arrependam-se, e cada um de vocês seja batizado em nome de Jesus Cristo para perdão dos seus pecados, e receberão o dom do Espírito Santo."'
            }
        },
        'ar': {
            'sv': {
                'john.3.16': 'لأَنَّهُ هكَذَا أَحَبَّ اللهُ الْعَالَمَ، حَتَّى بَذَلَ ابْنَهُ الْوَحِيدَ، لِكَيْ لاَ يَهْلِكَ كُلُّ مَنْ يُؤْمِنُ بِهِ، بَلْ تَكُونُ لَهُ الْحَيَاةُ الأَبَدِيَّةُ.',
                'gen.1.1': 'فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.',
                'psalm.23.1': 'الرَّبُّ رَاعِيَّ، فَلاَ أَعْوَزُ شَيْئًا.',
                'matt.6.9': 'فَصَلُّوا أَنْتُمْ هكَذَا: أَبَانَا الَّذِي فِي السَّمَاوَاتِ، لِيَتَقَدَّسِ اسْمُكَ.',
                'acts.2.38': 'فَقَالَ لَهُمْ بُطْرُسُ: «تُوبُوا، وَلْيَعْتَمِدْ كُلُّ وَاحِدٍ مِنْكُمْ عَلَى اسْمِ يَسُوعَ الْمَسِيحِ لِغُفْرَانِ الْخَطَايَا، فَتَنَالُوا عَطِيَّةَ الرُّوحِ الْقُدُسِ.'
            }
        },
        'zh': {
            'cuv': {
                'john.3.16': '神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不至灭亡，反得永生。',
                'gen.1.1': '起初神创造天地。',
                'psalm.23.1': '耶和华是我的牧者，我必不致缺乏。',
                'matt.6.9': '所以，你们祷告要这样说：我们在天上的父：愿人都尊你的名为圣。',
                'acts.2.38': '彼得说：你们各人要悔改，奉耶稣基督的名受洗，叫你们的罪得赦，就必领受所赐的圣灵。'
            }
        }
    };

    // Bible book information
    const bibleBooks = {
        'en': {
            'gen': 'Genesis', 'exod': 'Exodus', 'lev': 'Leviticus', 'num': 'Numbers', 'deut': 'Deuteronomy',
            'josh': 'Joshua', 'judg': 'Judges', 'ruth': 'Ruth', 'sam1': '1 Samuel', 'sam2': '2 Samuel',
            'kings1': '1 Kings', 'kings2': '2 Kings', 'chr1': '1 Chronicles', 'chr2': '2 Chronicles', 'ezra': 'Ezra',
            'neh': 'Nehemiah', 'esth': 'Esther', 'job': 'Job', 'psalm': 'Psalms', 'prov': 'Proverbs',
            'eccl': 'Ecclesiastes', 'song': 'Song of Solomon', 'isa': 'Isaiah', 'jer': 'Jeremiah',
            'lam': 'Lamentations', 'ezek': 'Ezekiel', 'dan': 'Daniel', 'hosea': 'Hosea', 'joel': 'Joel',
            'amos': 'Amos', 'obad': 'Obadiah', 'jonah': 'Jonah', 'micah': 'Micah', 'nahum': 'Nahum',
            'hab': 'Habakkuk', 'zeph': 'Zephaniah', 'hag': 'Haggai', 'zech': 'Zechariah', 'mal': 'Malachi',
            'matt': 'Matthew', 'mark': 'Mark', 'luke': 'Luke', 'john': 'John', 'acts': 'Acts',
            'rom': 'Romans', 'cor1': '1 Corinthians', 'cor2': '2 Corinthians', 'gal': 'Galatians',
            'eph': 'Ephesians', 'phil': 'Philippians', 'col': 'Colossians', 'thess1': '1 Thessalonians',
            'thess2': '2 Thessalonians', 'tim1': '1 Timothy', 'tim2': '2 Timothy', 'titus': 'Titus',
            'philem': 'Philemon', 'heb': 'Hebrews', 'jas': 'James', 'pet1': '1 Peter',
            'pet2': '2 Peter', 'john1': '1 John', 'john2': '2 John', 'john3': '3 John', 'jude': 'Jude', 'rev': 'Revelation'
        },
        'sn': {
            'gen': 'Uvarirani', 'exod': 'Kubuda', 'lev': 'Levitiko', 'num': 'Nhamba', 'deut': 'Duteronomi',
            'josh': 'Joshua', 'judg': 'Vatongi', 'ruth': 'Ruth', 'sam1': '1 Samuel', 'sam2': '2 Samuel',
            'kings1': '1 Mambo', 'kings2': '2 Mambo', 'chr1': '1 Zvirongwa', 'chr2': '2 Zvirongwa',
            'ezra': 'Ezra', 'neh': 'Nehemia', 'esth': 'Esther', 'job': 'Job', 'psalm': 'Zvita raMambo Mwari',
            'prov': 'Zvita raNhanga', 'eccl': 'Munhu weMatsva', 'song': 'Rudo RweChimurenga', 'isa': 'Isaya',
            'jer': 'Jeremia', 'lam': 'Danga Rwenhere', 'ezek': 'Ezekieri', 'dan': 'Danieli',
            'hosea': 'Hosea', 'joel': 'Johani', 'amos': 'Amosi', 'obad': 'Obadia', 'jonah': 'Jona',
            'micah': 'Mika', 'nahum': 'Nahumu', 'hab': 'Habakuki', 'zeph': 'Zefania', 'hag': 'Hagai',
            'zech': 'Zekaria', 'mal': 'Malaki', 'matt': 'Matayo', 'mark': 'Marko', 'luke': 'Luka',
            'john': 'Johani', 'acts': 'Zviito', 'rom': 'Varema', 'cor1': '1 Vakorinde', 'cor2': '2 Vakorinde',
            'gal': 'Galatia', 'eph': 'Efezo', 'phil': 'Filipi', 'col': 'Kolose', 'thess1': '1 Tesalonika',
            'thess2': '2 Tesalonika', 'tim1': '1 Timotheo', 'tim2': '2 Timotheo', 'titus': 'Tito',
            'philem': 'Filemoni', 'heb': 'Vaeberi', 'jas': 'Jakobo', 'pet1': '1 Petro', 'pet2': '2 Petro',
            'john1': '1 Johani', 'john2': '2 Johani', 'john3': '3 Johani', 'jude': 'Juda', 'rev': 'Ukumbiridzo'
        }
    };

    // Get specific Bible verse
    app.get('/api/bible/verse', (req, res) => {
        try {
            const { book, chapter, verse, language = 'en', translation = 'kjv' } = req.query;
            
            if (!book || !chapter || !verse) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Book, chapter, and verse parameters are required'
                });
            }

            const verseKey = `${book.toLowerCase()}.${chapter}.${verse}`;
            const verseData = bibleData[language]?.[translation]?.[verseKey];

            if (!verseData) {
                // Return a default verse if not found
                const defaultVerse = language === 'sn' ? 
                    'Zvita raMambo Mwari 23:1 - Jehovah ndimi shepherd yangu; handingadi chero zvaizvi.' :
                    'Psalm 23:1 - The LORD is my shepherd; I shall not want.';
                
                return res.json({
                    status: 'success',
                    message: 'Verse retrieved (default returned)',
                    data: {
                        book: book,
                        chapter: chapter,
                        verse: verse,
                        language: language,
                        translation: translation,
                        text: defaultVerse,
                        note: 'Default verse returned. Add more verses to the database for complete coverage.'
                    }
                });
            }

            res.json({
                status: 'success',
                message: 'Verse retrieved successfully',
                data: {
                    book: book,
                    chapter: chapter,
                    verse: verse,
                    language: language,
                    translation: translation,
                    text: verseData,
                    reference: `${bibleBooks[language]?.[book.toLowerCase()] || book} ${chapter}:${verse}`
                }
            });
        } catch (error) {
            console.error('Bible verse error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve Bible verse',
                error: error.message
            });
        }
    });

    // Search Bible by keyword
    app.get('/api/bible/search', (req, res) => {
        try {
            const { keyword, language = 'en', translation = 'kjv' } = req.query;
            
            if (!keyword) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Keyword parameter is required'
                });
            }

            const results = [];
            const bibleVersion = bibleData[language]?.[translation] || {};
            
            // Search through all verses
            for (const [verseKey, verseText] of Object.entries(bibleVersion)) {
                if (verseText.toLowerCase().includes(keyword.toLowerCase())) {
                    const [book, chapter, verse] = verseKey.split('.');
                    results.push({
                        book: book,
                        chapter: chapter,
                        verse: verse,
                        text: verseText,
                        reference: `${bibleBooks[language]?.[book] || book} ${chapter}:${verse}`,
                        matchType: 'keyword'
                    });
                }
            }

            // Sort by relevance (first match, shortest verse)
            results.sort((a, b) => a.text.length - b.text.length);

            res.json({
                status: 'success',
                message: `Found ${results.length} verses containing "${keyword}"`,
                data: {
                    keyword: keyword,
                    language: language,
                    translation: translation,
                    totalResults: results.length,
                    verses: results.slice(0, 20), // Limit to 20 results
                    hasMore: results.length > 20
                }
            });
        } catch (error) {
            console.error('Bible search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Bible search failed',
                error: error.message
            });
        }
    });

    // Get Bible chapter
    app.get('/api/bible/chapter', (req, res) => {
        try {
            const { book, chapter, language = 'en', translation = 'kjv' } = req.query;
            
            if (!book || !chapter) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Book and chapter parameters are required'
                });
            }

            const chapterVerses = {};
            const bibleVersion = bibleData[language]?.[translation] || {};
            
            // Get all verses for the chapter
            for (const [verseKey, verseText] of Object.entries(bibleVersion)) {
                const [verseBook, verseChapter, verseNumber] = verseKey.split('.');
                if (verseBook === book.toLowerCase() && verseChapter === chapter) {
                    chapterVerses[verseNumber] = verseText;
                }
            }

            const verseNumbers = Object.keys(chapterVerses).map(Number).sort((a, b) => a - b);
            const sortedVerses = {};
            verseNumbers.forEach(num => {
                sortedVerses[num.toString()] = chapterVerses[num.toString()];
            });

            res.json({
                status: 'success',
                message: 'Chapter retrieved successfully',
                data: {
                    book: book,
                    chapter: chapter,
                    language: language,
                    translation: translation,
                    verses: sortedVerses,
                    totalVerses: verseNumbers.length,
                    reference: `${bibleBooks[language]?.[book.toLowerCase()] || book} ${chapter}`
                }
            });
        } catch (error) {
            console.error('Bible chapter error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve Bible chapter',
                error: error.message
            });
        }
    });

    // Verse of the day
    app.get('/api/bible/votd', (req, res) => {
        try {
            const { language = 'en', translation = 'kjv' } = req.query;
            
            const popularVerses = [
                { book: 'john', chapter: '3', verse: '16', theme: 'Love & Salvation' },
                { book: 'psalm', chapter: '23', verse: '1', theme: 'Trust & Guidance' },
                { book: 'gen', chapter: '1', verse: '1', theme: 'Creation' },
                { book: 'matt', chapter: '6', verse: '9', theme: 'Prayer' },
                { book: 'acts', chapter: '2', verse: '38', theme: 'Repentance & Baptism' },
                { book: 'phil', chapter: '4', verse: '13', theme: 'Strength' },
                { book: 'rom', chapter: '8', verse: '28', theme: 'Providence' },
                { book: 'isa', chapter: '41', verse: '10', theme: 'Courage' }
            ];

            // Select verse based on date
            const today = new Date();
            const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
            const selectedVerse = popularVerses[dayOfYear % popularVerses.length];

            const verseKey = `${selectedVerse.book}.${selectedVerse.chapter}.${selectedVerse.verse}`;
            const verseText = bibleData[language]?.[translation]?.[verseKey];

            const defaultText = language === 'sn' ? 
                'Jehovah ndimi shepherd yangu; handingadi chero zvaizvi.' :
                'The LORD is my shepherd; I shall not want.';

            res.json({
                status: 'success',
                message: 'Verse of the day retrieved successfully',
                data: {
                    date: today.toISOString().split('T')[0],
                    verse: {
                        book: selectedVerse.book,
                        chapter: selectedVerse.chapter,
                        verse: selectedVerse.verse,
                        text: verseText || defaultText,
                        theme: selectedVerse.theme,
                        reference: `${bibleBooks[language]?.[selectedVerse.book] || selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse}`,
                        language: language,
                        translation: translation
                    },
                    reflection: language === 'sn' ? 
                        'Verenga uye funga nezve kuti izvi zvinoshanda sei pamupenyu wenyu nhasi.' :
                        'Read and reflect on how this verse applies to your life today.'
                }
            });
        } catch (error) {
            console.error('Verse of the day error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve verse of the day',
                error: error.message
            });
        }
    });

    // Get available translations
    app.get('/api/bible/translations', (req, res) => {
        try {
            const translations = {};
            
            for (const [lang, versions] of Object.entries(bibleData)) {
                translations[lang] = Object.keys(versions).map(version => ({
                    code: version,
                    name: getTranslationName(lang, version),
                    language: getLanguageName(lang)
                }));
            }

            res.json({
                status: 'success',
                message: 'Available translations retrieved successfully',
                data: {
                    translations: translations,
                    totalLanguages: Object.keys(bibleData).length,
                    totalTranslations: Object.values(bibleData).reduce((sum, versions) => sum + Object.keys(versions).length, 0)
                }
            });
        } catch (error) {
            console.error('Translations error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve translations',
                error: error.message
            });
        }
    });

    // Get list of Bible books
    app.get('/api/bible/books', (req, res) => {
        try {
            const { language = 'en' } = req.query;
            
            const books = bibleBooks[language] || bibleBooks['en'];
            const bookList = Object.entries(books).map(([code, name]) => ({
                code: code,
                name: name,
                testament: getTestament(code)
            }));

            res.json({
                status: 'success',
                message: 'Bible books retrieved successfully',
                data: {
                    language: language,
                    books: bookList,
                    totalBooks: bookList.length,
                    oldTestament: bookList.filter(b => b.testament === 'Old').length,
                    newTestament: bookList.filter(b => b.testament === 'New').length
                }
            });
        } catch (error) {
            console.error('Bible books error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve Bible books',
                error: error.message
            });
        }
    });
};

function getTranslationName(language, translation) {
    const names = {
        'en': {
            'kjv': 'King James Version',
            'niv': 'New International Version'
        },
        'sn': {
            'bhaibheri': 'Bhaibheri reChiShona'
        },
        'es': {
            'rvr': 'Reina-Valera Revisada'
        },
        'fr': {
            'lsg': 'Louis Segond'
        },
        'pt': {
            'nvi': 'Nova Versão Internacional'
        },
        'ar': {
            'sv': 'Smith-Van Dyke'
        },
        'zh': {
            'cuv': 'Chinese Union Version'
        }
    };
    return names[language]?.[translation] || translation.toUpperCase();
}

function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'sn': 'Shona (ChiShona)',
        'es': 'Español (Spanish)',
        'fr': 'Français (French)',
        'pt': 'Português (Portuguese)',
        'ar': 'العربية (Arabic)',
        'zh': '中文 (Chinese)'
    };
    return languages[code] || code.toUpperCase();
}

function getTestament(bookCode) {
    const newTestamentBooks = ['matt', 'mark', 'luke', 'john', 'acts', 'rom', 'cor1', 'cor2', 'gal', 'eph', 'phil', 'col', 'thess1', 'thess2', 'tim1', 'tim2', 'titus', 'philem', 'heb', 'jas', 'pet1', 'pet2', 'john1', 'john2', 'john3', 'jude', 'rev'];
    return newTestamentBooks.includes(bookCode) ? 'New' : 'Old';
}