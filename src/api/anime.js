const axios = require('axios');

module.exports = (app) => {
    // Mock anime database for demonstration
    const animeDatabase = [
        {
            id: 'anime_001',
            title: 'Attack on Titan',
            titleJapanese: '進撃の巨人',
            titleEnglish: 'Attack on Titan',
            synonyms: ['Shingeki no Kyojin'],
            type: 'TV',
            episodes: 87,
            status: 'Finished Airing',
            airing: false,
            rating: 'R - 17+ (violence & profanity)',
            score: 8.54,
            scoredBy: 2100000,
            rank: 1,
            popularity: 1,
            members: 2800000,
            favorites: 95000,
            season: 'Spring 2013',
            year: 2013,
            premiered: 'Spring 2013',
            broadcast: 'Saturdays at 23:00 (JST)',
            producers: ['Production I.G', 'Mainichi Broadcasting'],
            licensors: ['Funimation', 'Crunchyroll'],
            studios: ['Wit Studio', 'MAPPA'],
            source: 'Manga',
            genres: ['Action', 'Drama', 'Fantasy', 'Military', 'Mystery', 'Shounen', 'Super Power'],
            themes: ['Dark Fantasy', 'Military', 'Post-Apocalyptic'],
            demographic: 'Shounen',
            duration: '24 min per ep',
            rating: 'R',
            synopsis: 'Several hundred years ago, humans were nearly exterminated by titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source. A small percentage of humanity survived by walling themselves in a city protected by extremely high walls, even taller than the biggest titans.',
            background: 'Attack on Titan has become a cultural phenomenon, inspiring numerous adaptations, merchandise, and even academic discussions about its themes.',
            openingThemes: ['"Guren no Yumiya" by Linked Horizon'],
            endingThemes: ['"Utsukushiki Zankoku na Sekai" by Yoko Hikasa'],
            related: {
                adaptation: [{ id: 'manga_001', type: 'Manga', title: 'Attack on Titan Manga' }],
                prequel: [{ id: 'anime_001_pre', type: 'Special', title: 'Attack on Titan: No Regrets' }],
                sequel: [{ id: 'anime_001_seq', type: 'Movie', title: 'Attack on Titan: The Final Season' }]
            },
            characters: [
                { name: 'Eren Yeager', role: 'Main', voiceActor: 'Yuki Kaji' },
                { name: 'Mikasa Ackerman', role: 'Main', voiceActor: 'Yui Ishikawa' },
                { name: 'Armin Arlert', role: 'Main', voiceActor: 'Marina Inoue' }
            ],
            images: {
                jpg: {
                    large_image_url: 'https://picsum.photos/1200/675?random=aot_large',
                    small_image_url: 'https://picsum.photos/560/315?random=aot_small'
                },
                webp: {
                    large_image_url: 'https://picsum.photos/1200/675?random=aot_large_webp',
                    small_image_url: 'https://picsum.photos/560/315?random=aot_small_webp'
                }
            },
            trailer: {
                url: 'https://mock-trailer.com/aot-trailer.mp4',
                embed_url: 'https://mock-trailer.com/aot-trailer',
                youtube_id: 'LHtmn4q3p9I'
            }
        },
        {
            id: 'anime_002',
            title: 'Demon Slayer: Kimetsu no Yaiba',
            titleJapanese: '鬼滅の刃',
            titleEnglish: 'Demon Slayer: Kimetsu no Yaiba',
            synonyms: ['Kimetsu no Yaiba'],
            type: 'TV',
            episodes: 26,
            status: 'Finished Airing',
            airing: false,
            rating: 'R - 17+ (violence & profanity)',
            score: 8.73,
            scoredBy: 1900000,
            rank: 2,
            popularity: 2,
            members: 2600000,
            favorites: 89000,
            season: 'Spring 2019',
            year: 2019,
            premiered: 'Spring 2019',
            broadcast: 'Saturdays at 23:30 (JST)',
            producers: ['Aniplex', 'NBCUniversal Entertainment Japan'],
            licensors: ['Aniplex of America', 'Crunchyroll'],
            studios: ['Ufotable'],
            source: 'Manga',
            genres: ['Action', 'Historical', 'Shounen', 'Supernatural'],
            themes: ['Demons', 'Historical', 'Martial Arts', 'Samurai'],
            demographic: 'Shounen',
            duration: '23 min per ep',
            rating: 'R',
            synopsis: 'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated by this grim reality, Tanjiro resolves to become a demon slayer so that he can turn his sister back into a human, and kill the demon that massacred his family.',
            background: 'Demon Slayer became one of the highest-grossing media franchises of all time, breaking box office records with its film adaptation.',
            openingThemes: ['"Gurenge" by LiSA'],
            endingThemes: ['"From the Edge" by FictionJunction'],
            related: {
                adaptation: [{ id: 'manga_002', type: 'Manga', title: 'Demon Slayer Manga' }],
                sequel: [{ id: 'anime_002_movie', type: 'Movie', title: 'Demon Slayer: Mugen Train' }]
            },
            characters: [
                { name: 'Tanjiro Kamado', role: 'Main', voiceActor: 'Natsuki Hanae' },
                { name: 'Nezuko Kamado', role: 'Main', voiceActor: 'Akari Kitou' },
                { name: 'Zenitsu Agatsuma', role: 'Supporting', voiceActor: 'Hiroshi Kamiya' }
            ],
            images: {
                jpg: {
                    large_image_url: 'https://picsum.photos/1200/675?random=demon_large',
                    small_image_url: 'https://picsum.photos/560/315?random=demon_small'
                },
                webp: {
                    large_image_url: 'https://picsum.photos/1200/675?random=demon_large_webp',
                    small_image_url: 'https://picsum.photos/560/315?random=demon_small_webp'
                }
            },
            trailer: {
                url: 'https://mock-trailer.com/demon-trailer.mp4',
                embed_url: 'https://mock-trailer.com/demon-trailer',
                youtube_id: 'Vjsp9tYb9iE'
            }
        },
        {
            id: 'anime_003',
            title: 'One Piece',
            titleJapanese: 'ONE PIECE',
            titleEnglish: 'One Piece',
            synonyms: ['OP'],
            type: 'TV',
            episodes: 1080,
            status: 'Currently Airing',
            airing: true,
            rating: 'PG-13 - Teens 13 or older',
            score: 8.95,
            scoredBy: 1700000,
            rank: 3,
            popularity: 3,
            members: 3200000,
            favorites: 120000,
            season: 'Fall 1999',
            year: 1999,
            premiered: 'Fall 1999',
            broadcast: 'Sundays at 09:30 (JST)',
            producers: ['Fuji TV', 'Toei Animation'],
            licensors: ['Funimation', 'Crunchyroll'],
            studios: ['Toei Animation'],
            source: 'Manga',
            genres: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Shounen'],
            themes: ['Adventure', 'Comedy', 'Super Power', 'Treasure Hunters'],
            demographic: 'Shounen',
            duration: '24 min per ep',
            rating: 'PG-13',
            synopsis: 'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.',
            background: 'One Piece is the best-selling manga series in history and has been adapted into an anime that has been running for over 20 years.',
            openingThemes: ['"We Are!" by Hiroshi Kitadani'],
            endingThemes: ['"Memories" by Maki Otsuki'],
            related: {
                adaptation: [{ id: 'manga_003', type: 'Manga', title: 'One Piece Manga' }],
                sequel: [{ id: 'anime_003_movies', type: 'Movie', title: 'One Piece Film Series' }]
            },
            characters: [
                { name: 'Monkey D. Luffy', role: 'Main', voiceActor: 'Mayumi Tanaka' },
                { name: 'Roronoa Zoro', role: 'Main', voiceActor: 'Kazuya Nakai' },
                { name: 'Nami', role: 'Main', voiceActor: 'Akemi Okamura' }
            ],
            images: {
                jpg: {
                    large_image_url: 'https://picsum.photos/1200/675?random=onepiece_large',
                    small_image_url: 'https://picsum.photos/560/315?random=onepiece_small'
                },
                webp: {
                    large_image_url: 'https://picsum.photos/1200/675?random=onepiece_large_webp',
                    small_image_url: 'https://picsum.photos/560/315?random=onepiece_small_webp'
                }
            },
            trailer: {
                url: 'https://mock-trailer.com/onepiece-trailer.mp4',
                embed_url: 'https://mock-trailer.com/onepiece-trailer',
                youtube_id: 'tOOs8CRhG4k'
            }
        }
    ];

    // Search anime
    app.get('/api/anime/search', (req, res) => {
        try {
            const { 
                query, 
                type, 
                status, 
                rating, 
                genres, 
                year, 
                season,
                minScore, 
                maxEpisodes,
                sortBy = 'popularity',
                order = 'desc',
                limit = 20
            } = req.query;

            let results = [...animeDatabase];

            // Filter by search query
            if (query) {
                const searchTerm = query.toLowerCase();
                results = results.filter(anime => 
                    anime.title.toLowerCase().includes(searchTerm) ||
                    anime.titleJapanese.toLowerCase().includes(searchTerm) ||
                    anime.titleEnglish.toLowerCase().includes(searchTerm) ||
                    anime.synopsis.toLowerCase().includes(searchTerm) ||
                    anime.synonyms.some(syn => syn.toLowerCase().includes(searchTerm))
                );
            }

            // Filter by type
            if (type) {
                results = results.filter(anime => 
                    anime.type.toLowerCase() === type.toLowerCase()
                );
            }

            // Filter by status
            if (status) {
                const statusFilter = status.toLowerCase();
                if (statusFilter === 'airing') {
                    results = results.filter(anime => anime.airing);
                } else if (statusFilter === 'completed') {
                    results = results.filter(anime => !anime.airing);
                }
            }

            // Filter by rating
            if (rating) {
                results = results.filter(anime => 
                    anime.rating.toLowerCase().includes(rating.toLowerCase())
                );
            }

            // Filter by genres
            if (genres) {
                const genreArray = genres.split(',').map(g => g.trim().toLowerCase());
                results = results.filter(anime => 
                    genreArray.every(genre => 
                        anime.genres.some(g => g.toLowerCase() === genre)
                    )
                );
            }

            // Filter by year
            if (year) {
                results = results.filter(anime => anime.year.toString() === year);
            }

            // Filter by season
            if (season) {
                results = results.filter(anime => 
                    anime.season.toLowerCase().includes(season.toLowerCase())
                );
            }

            // Filter by minimum score
            if (minScore) {
                results = results.filter(anime => anime.score >= parseFloat(minScore));
            }

            // Filter by maximum episodes
            if (maxEpisodes) {
                results = results.filter(anime => anime.episodes <= parseInt(maxEpisodes));
            }

            // Sort results
            results = sortAnime(results, sortBy, order);

            const limitedResults = results.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Found ${results.length} anime matching your criteria`,
                data: {
                    anime: limitedResults.map(anime => ({
                        id: anime.id,
                        title: anime.title,
                        titleJapanese: anime.titleJapanese,
                        titleEnglish: anime.titleEnglish,
                        type: anime.type,
                        episodes: anime.episodes,
                        status: anime.status,
                        airing: anime.airing,
                        rating: anime.rating,
                        score: anime.score,
                        year: anime.year,
                        season: anime.season,
                        genres: anime.genres,
                        synopsis: anime.synopsis.substring(0, 200) + '...',
                        image: anime.images.jpg.large_image_url
                    })),
                    totalResults: results.length,
                    searchCriteria: {
                        query, type, status, rating, genres, year, season, minScore, maxEpisodes, sortBy, order, limit
                    }
                }
            });
        } catch (error) {
            console.error('Anime search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Anime search failed',
                error: error.message
            });
        }
    });

    // Get detailed anime information
    app.get('/api/anime/:animeId', (req, res) => {
        try {
            const { animeId } = req.params;
            
            const anime = animeDatabase.find(a => a.id === animeId);
            
            if (!anime) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Anime not found'
                });
            }

            // Add additional detailed information
            const detailedAnime = {
                ...anime,
                statistics: {
                    watching: Math.floor(anime.members * 0.15),
                    completed: Math.floor(anime.members * 0.65),
                    onHold: Math.floor(anime.members * 0.05),
                    dropped: Math.floor(anime.members * 0.08),
                    planToWatch: Math.floor(anime.members * 0.07)
                },
                reviews: {
                    total: Math.floor(Math.random() * 10000) + 1000,
                    averageRating: (anime.score - 1).toFixed(1),
                    positivePercentage: Math.floor(Math.random() * 30) + 70
                },
                recommendations: [
                    animeDatabase.find(a => a.id !== animeId && a.genres.some(g => anime.genres.includes(g))) || animeDatabase[0],
                    animeDatabase.find(a => a.id !== animeId && a.studios.some(s => anime.studios.includes(s))) || animeDatabase[1]
                ],
                streaming: {
                    platforms: ['Crunchyroll', 'Funimation', 'Hulu', 'Netflix'],
                    availability: 'Available in most regions',
                    simulcast: anime.airing
                },
                community: {
                    forums: Math.floor(Math.random() * 5000) + 1000,
                    fanArt: Math.floor(Math.random() * 10000) + 2000,
                    cosplay: Math.floor(Math.random() * 3000) + 500,
                    discussions: Math.floor(Math.random() * 8000) + 1500
                },
                awards: [
                    {
                        name: 'Anime of the Year',
                        year: anime.year + 1,
                        organization: 'Anime Awards'
                    }
                ].filter(() => Math.random() > 0.5)
            };

            res.json({
                status: 'success',
                message: 'Anime information retrieved successfully',
                data: detailedAnime
            });
        } catch (error) {
            console.error('Anime details error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve anime information',
                error: error.message
            });
        }
    });

    // Get anime characters
    app.get('/api/anime/:animeId/characters', (req, res) => {
        try {
            const { animeId } = req.params;
            
            const anime = animeDatabase.find(a => a.id === animeId);
            
            if (!anime) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Anime not found'
                });
            }

            // Enhance character data with additional details
            const enhancedCharacters = anime.characters.map(char => ({
                ...char,
                image: `https://picsum.photos/300/450?random=char_${char.name.replace(/\s/g, '')}`,
                description: `${char.role} character in ${anime.title}. Known for their memorable personality and development throughout the series.`,
                favorites: Math.floor(Math.random() * 10000) + 1000,
                appearances: Math.floor(Math.random() * anime.episodes) + 1,
                firstAppearance: `Episode ${Math.floor(Math.random() * 10) + 1}`
            }));

            res.json({
                status: 'success',
                message: 'Anime characters retrieved successfully',
                data: {
                    animeId: animeId,
                    animeTitle: anime.title,
                    characters: enhancedCharacters,
                    totalCharacters: enhancedCharacters.length
                }
            });
        } catch (error) {
            console.error('Anime characters error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve anime characters',
                error: error.message
            });
        }
    });

    // Get currently airing anime
    app.get('/api/anime/season', (req, res) => {
        try {
            const { 
                year = new Date().getFullYear(), 
                season = getCurrentSeason(),
                limit = 20 
            } = req.query;

            const currentSeasonAnime = animeDatabase
                .filter(anime => anime.season.toLowerCase().includes(season.toLowerCase()) && anime.year.toString() === year)
                .concat(generateMockSeasonAnime(parseInt(limit), season, year));

            const sortedAnime = sortAnime(currentSeasonAnime, 'popularity', 'desc');
            const limitedResults = sortedAnime.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Retrieved ${limitedResults.length} anime for ${season} ${year}`,
                data: {
                    season: season,
                    year: year,
                    anime: limitedResults,
                    totalResults: limitedResults.length
                }
            });
        } catch (error) {
            console.error('Season anime error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve seasonal anime',
                error: error.message
            });
        }
    });

    // Get anime by genre
    app.get('/api/anime/genre/:genre', (req, res) => {
        try {
            const { genre } = req.params;
            const { limit = 20, sortBy = 'score' } = req.query;
            
            const genreAnime = animeDatabase.filter(anime => 
                anime.genres.some(g => g.toLowerCase() === genre.toLowerCase())
            );

            // Add mock results if needed
            if (genreAnime.length < parseInt(limit)) {
                const mockAnime = generateMockGenreAnime(parseInt(limit) - genreAnime.length, genre);
                genreAnime.push(...mockAnime);
            }

            const sortedAnime = sortAnime(genreAnime, sortBy, 'desc');
            const limitedResults = sortedAnime.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Found ${genreAnime.length} anime in ${genre} genre`,
                data: {
                    genre: genre,
                    anime: limitedResults,
                    totalResults: genreAnime.length
                }
            });
        } catch (error) {
            console.error('Genre anime error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve anime by genre',
                error: error.message
            });
        }
    });

    // Get top anime
    app.get('/api/anime/top', (req, res) => {
        try {
            const { 
                type = 'all', 
                limit = 50, 
                filter = 'airing' 
            } = req.query;

            let topAnime = [...animeDatabase];

            // Apply filter
            if (filter === 'airing') {
                topAnime = topAnime.filter(anime => anime.airing);
            } else if (filter === 'completed') {
                topAnime = topAnime.filter(anime => !anime.airing);
            } else if (filter === 'upcoming') {
                topAnime = generateMockUpcomingAnime(parseInt(limit));
            }

            // Sort by score for top anime
            topAnime = sortAnime(topAnime, 'score', 'desc');
            const limitedResults = topAnime.slice(0, Math.min(parseInt(limit), 100));

            res.json({
                status: 'success',
                message: `Retrieved top ${limitedResults.length} anime`,
                data: {
                    topType: type,
                    filter: filter,
                    anime: limitedResults,
                    totalResults: limitedResults.length,
                    lastUpdated: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Top anime error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve top anime',
                error: error.message
            });
        }
    });

    // Get anime recommendations
    app.get('/api/anime/recommendations/:animeId', (req, res) => {
        try {
            const { animeId } = req.params;
            const { limit = 10 } = req.query;
            
            const anime = animeDatabase.find(a => a.id === animeId);
            
            if (!anime) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Anime not found'
                });
            }

            // Generate recommendations based on similar genres, studios, and themes
            const recommendations = generateRecommendations(anime, parseInt(limit));

            res.json({
                status: 'success',
                message: 'Anime recommendations generated successfully',
                data: {
                    basedOn: {
                        id: anime.id,
                        title: anime.title,
                        genres: anime.genres,
                        studios: anime.studios
                    },
                    recommendations: recommendations.map(rec => ({
                        ...rec,
                        recommendationReason: getRecommendationReason(anime, rec)
                    })),
                    totalRecommendations: recommendations.length
                }
            });
        } catch (error) {
            console.error('Anime recommendations error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to generate recommendations',
                error: error.message
            });
        }
    });

    // Search anime by studio
    app.get('/api/anime/studio/:studioName', (req, res) => {
        try {
            const { studioName } = req.params;
            const { limit = 20 } = req.query;
            
            const studioAnime = animeDatabase.filter(anime => 
                anime.studios.some(studio => 
                    studio.toLowerCase().includes(studioName.toLowerCase())
                )
            );

            const sortedAnime = sortAnime(studioAnime, 'score', 'desc');
            const limitedResults = sortedAnime.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Found ${studioAnime.length} anime from studio ${studioName}`,
                data: {
                    studio: studioName,
                    anime: limitedResults,
                    totalResults: studioAnime.length,
                    statistics: {
                        totalSeries: studioAnime.length,
                        averageScore: studioAnime.length > 0 ? 
                            (studioAnime.reduce((sum, a) => sum + a.score, 0) / studioAnime.length).toFixed(2) : 0,
                        totalEpisodes: studioAnime.reduce((sum, a) => sum + a.episodes, 0)
                    }
                }
            });
        } catch (error) {
            console.error('Studio anime error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve anime by studio',
                error: error.message
            });
        }
    });
};

// Helper functions
function sortAnime(animeList, sortBy, order = 'desc') {
    const sorted = [...animeList];
    
    switch (sortBy.toLowerCase()) {
        case 'score':
        case 'rating':
            sorted.sort((a, b) => b.score - a.score);
            break;
        case 'popularity':
            sorted.sort((a, b) => b.members - a.members);
            break;
        case 'episodes':
            sorted.sort((a, b) => b.episodes - a.episodes);
            break;
        case 'year':
            sorted.sort((a, b) => b.year - a.year);
            break;
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            sorted.sort((a, b) => b.score - a.score);
    }
    
    return order === 'asc' ? sorted.reverse() : sorted;
}

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
}

function generateMockSeasonAnime(count, season, year) {
    const anime = [];
    for (let i = 0; i < count; i++) {
        anime.push({
            id: `season_anime_${Date.now()}_${i}`,
            title: `Seasonal Anime ${i + 1}`,
            titleJapanese: `シーズナルアニメ${i + 1}`,
            titleEnglish: `Seasonal Anime ${i + 1}`,
            type: 'TV',
            episodes: Math.floor(Math.random() * 24) + 12,
            status: 'Currently Airing',
            airing: true,
            rating: 'PG-13',
            score: Math.random() * 2 + 7,
            scoredBy: Math.floor(Math.random() * 500000) + 100000,
            rank: i + 1,
            popularity: i + 1,
            members: Math.floor(Math.random() * 1000000) + 100000,
            favorites: Math.floor(Math.random() * 50000) + 5000,
            season: season,
            year: parseInt(year),
            premiered: `${season} ${year}`,
            genres: ['Action', 'Adventure', 'Comedy'].sort(() => Math.random() - 0.5).slice(0, 2),
            synopsis: `This is a new ${season.toLowerCase()} ${year} anime with exciting adventures and memorable characters.`,
            images: {
                jpg: {
                    large_image_url: `https://picsum.photos/1200/675?random=season${Date.now()}${i}`,
                    small_image_url: `https://picsum.photos/560/315?random=season_small${Date.now()}${i}`
                }
            }
        });
    }
    return anime;
}

function generateMockGenreAnime(count, genre) {
    const anime = [];
    for (let i = 0; i < count; i++) {
        anime.push({
            id: `genre_anime_${genre}_${Date.now()}_${i}`,
            title: `${genre} Anime ${i + 1}`,
            type: 'TV',
            episodes: Math.floor(Math.random() * 50) + 12,
            status: Math.random() > 0.5 ? 'Currently Airing' : 'Finished Airing',
            airing: Math.random() > 0.5,
            score: Math.random() * 2 + 7,
            members: Math.floor(Math.random() * 1000000) + 100000,
            year: Math.floor(Math.random() * 10) + 2015,
            genres: [genre, 'Action', 'Adventure'].sort(() => Math.random() - 0.5).slice(0, 2),
            synopsis: `An exciting ${genre.toLowerCase()} anime with thrilling adventures and character development.`,
            images: {
                jpg: {
                    large_image_url: `https://picsum.photos/1200/675?random=genre${genre}${Date.now()}${i}`,
                    small_image_url: `https://picsum.photos/560/315?random=genre_small${genre}${Date.now()}${i}`
                }
            }
        });
    }
    return anime;
}

function generateMockUpcomingAnime(count) {
    const anime = [];
    const nextSeason = getNextSeason();
    
    for (let i = 0; i < count; i++) {
        anime.push({
            id: `upcoming_anime_${Date.now()}_${i}`,
            title: `Upcoming Anime ${i + 1}`,
            type: 'TV',
            episodes: null,
            status: 'Not Yet Aired',
            airing: false,
            score: null,
            members: Math.floor(Math.random() * 50000) + 10000,
            season: nextSeason.season,
            year: nextSeason.year,
            premiered: `${nextSeason.season} ${nextSeason.year}`,
            genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'].sort(() => Math.random() - 0.5).slice(0, 3),
            synopsis: `An upcoming anime scheduled for ${nextSeason.season} ${nextSeason.year}. Anticipated to be a thrilling series.`,
            images: {
                jpg: {
                    large_image_url: `https://picsum.photos/1200/675?random=upcoming${Date.now()}${i}`,
                    small_image_url: `https://picsum.photos/560/315?random=upcoming_small${Date.now()}${i}`
                }
            }
        });
    }
    return anime;
}

function getNextSeason() {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth();
    
    if (month >= 2 && month <= 4) return { season: 'Summer', year };
    if (month >= 5 && month <= 7) return { season: 'Fall', year };
    if (month >= 8 && month <= 10) return { season: 'Winter', year };
    return { season: 'Spring', year: month >= 11 ? year + 1 : year };
}

function generateRecommendations(baseAnime, count) {
    const recommendations = [];
    const allAnime = [...animeDatabase];
    
    // Remove the base anime
    const otherAnime = allAnime.filter(a => a.id !== baseAnime.id);
    
    for (let i = 0; i < Math.min(count, otherAnime.length); i++) {
        const anime = otherAnime[i];
        const similarityScore = calculateSimilarity(baseAnime, anime);
        
        recommendations.push({
            ...anime,
            similarityScore: similarityScore,
            recommendedReason: ''
        });
    }
    
    // Sort by similarity score
    recommendations.sort((a, b) => b.similarityScore - a.similarityScore);
    
    return recommendations.slice(0, count);
}

function calculateSimilarity(anime1, anime2) {
    let score = 0;
    
    // Genre similarity
    const commonGenres = anime1.genres.filter(g => anime2.genres.includes(g));
    score += commonGenres.length * 0.3;
    
    // Studio similarity
    const commonStudios = anime1.studios.filter(s => anime2.studios.includes(s));
    score += commonStudios.length * 0.2;
    
    // Rating similarity
    const scoreDiff = Math.abs(anime1.score - anime2.score);
    score += (1 - scoreDiff / 10) * 0.3;
    
    // Type similarity
    if (anime1.type === anime2.type) score += 0.2;
    
    return Math.min(score, 1);
}

function getRecommendationReason(baseAnime, recommendedAnime) {
    const commonGenres = baseAnime.genres.filter(g => recommendedAnime.genres.includes(g));
    const commonStudios = baseAnime.studios.filter(s => recommendedAnime.studios.includes(s));
    
    if (commonStudios.length > 0) {
        return `Same studio: ${commonStudios.join(', ')}`;
    }
    if (commonGenres.length >= 2) {
        return `Similar genres: ${commonGenres.join(', ')}`;
    }
    if (Math.abs(baseAnime.score - recommendedAnime.score) < 0.5) {
        return 'Similar rating';
    }
    return 'Popular in the same community';
}