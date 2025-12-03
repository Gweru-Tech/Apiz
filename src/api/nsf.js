const axios = require('axios');

module.exports = (app) => {
    // Mock NSF database for demonstration
    const nsfGrants = [
        {
            id: 'NSF-2024-001',
            title: 'Advanced Quantum Computing for Climate Modeling',
            abstract: 'This research explores the application of quantum computing algorithms to improve climate change prediction models.',
            PI: 'Dr. Sarah Johnson',
            institution: 'Massachusetts Institute of Technology',
            department: 'Computer Science',
            awardAmount: 1250000,
            startDate: '2024-09-01',
            endDate: '2027-08-31',
            program: 'Quantum Information Science',
            discipline: 'Computer Science',
            keywords: ['quantum computing', 'climate modeling', 'algorithms'],
            status: 'Active',
            state: 'MA'
        },
        {
            id: 'NSF-2024-002',
            title: 'Sustainable Energy Materials for Next Generation Solar Cells',
            abstract: 'Development of novel perovskite materials for enhanced solar energy conversion efficiency.',
            PI: 'Dr. Michael Chen',
            institution: 'Stanford University',
            department: 'Materials Science',
            awardAmount: 2100000,
            startDate: '2024-06-01',
            endDate: '2028-05-31',
            program: 'Materials Research',
            discipline: 'Materials Science',
            keywords: ['solar energy', 'perovskite', 'materials'],
            status: 'Active',
            state: 'CA'
        },
        {
            id: 'NSF-2023-156',
            title: 'Machine Learning for Drug Discovery',
            abstract: 'Applying artificial intelligence and machine learning techniques to accelerate pharmaceutical research.',
            PI: 'Dr. Emily Rodriguez',
            institution: 'Harvard Medical School',
            department: 'Biomedical Informatics',
            awardAmount: 1800000,
            startDate: '2023-09-01',
            endDate: '2026-08-31',
            program: 'Bioinformatics',
            discipline: 'Biology',
            keywords: ['machine learning', 'drug discovery', 'AI'],
            status: 'Active',
            state: 'MA'
        }
    ];

    const nsfInstitutions = [
        {
            id: 'INST-001',
            name: 'Massachusetts Institute of Technology',
            acronym: 'MIT',
            state: 'MA',
            city: 'Cambridge',
            type: 'University',
            totalAwards: 45,
            totalFunding: 125000000,
            rankings: { engineering: 1, computerScience: 1, physics: 2 },
            specialties: ['Engineering', 'Computer Science', 'Physics', 'Mathematics']
        },
        {
            id: 'INST-002',
            name: 'Stanford University',
            acronym: 'SU',
            state: 'CA',
            city: 'Stanford',
            type: 'University',
            totalAwards: 38,
            totalFunding: 98000000,
            rankings: { medicine: 2, computerScience: 2, biology: 1 },
            specialties: ['Medicine', 'Computer Science', 'Biology', 'Psychology']
        },
        {
            id: 'INST-003',
            name: 'Harvard University',
            acronym: 'HU',
            state: 'MA',
            city: 'Cambridge',
            type: 'University',
            totalAwards: 52,
            totalFunding: 156000000,
            rankings: { medicine: 1, law: 1, business: 1, humanities: 1 },
            specialties: ['Medicine', 'Law', 'Business', 'Humanities', 'Social Sciences']
        }
    ];

    // Search NSF Grants
    app.get('/api/nsf/grants/search', (req, res) => {
        try {
            const { 
                keyword, 
                discipline, 
                program, 
                state, 
                minAmount, 
                maxAmount,
                year = '2024',
                limit = 10 
            } = req.query;

            let results = [...nsfGrants];

            // Filter by keyword
            if (keyword) {
                const searchTerm = keyword.toLowerCase();
                results = results.filter(grant => 
                    grant.title.toLowerCase().includes(searchTerm) ||
                    grant.abstract.toLowerCase().includes(searchTerm) ||
                    grant.keywords.some(k => k.toLowerCase().includes(searchTerm))
                );
            }

            // Filter by discipline
            if (discipline) {
                results = results.filter(grant => 
                    grant.discipline.toLowerCase().includes(discipline.toLowerCase())
                );
            }

            // Filter by program
            if (program) {
                results = results.filter(grant => 
                    grant.program.toLowerCase().includes(program.toLowerCase())
                );
            }

            // Filter by state
            if (state) {
                results = results.filter(grant => 
                    grant.state.toLowerCase() === state.toLowerCase()
                );
            }

            // Filter by amount
            if (minAmount) {
                results = results.filter(grant => grant.awardAmount >= parseInt(minAmount));
            }
            if (maxAmount) {
                results = results.filter(grant => grant.awardAmount <= parseInt(maxAmount));
            }

            // Sort by award amount (descending)
            results.sort((a, b) => b.awardAmount - a.awardAmount);

            // Limit results
            const limitedResults = results.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Found ${results.length} grants matching your criteria`,
                data: {
                    grants: limitedResults,
                    totalResults: results.length,
                    searchCriteria: {
                        keyword, discipline, program, state, minAmount, maxAmount, year, limit
                    },
                    statistics: {
                        totalAwardAmount: results.reduce((sum, grant) => sum + grant.awardAmount, 0),
                        averageAward: results.length > 0 ? Math.round(results.reduce((sum, grant) => sum + grant.awardAmount, 0) / results.length) : 0,
                        topInstitution: getTopInstitution(results)
                    }
                }
            });
        } catch (error) {
            console.error('NSF grant search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Grant search failed',
                error: error.message
            });
        }
    });

    // Get specific grant details
    app.get('/api/nsf/grants/:grantId', (req, res) => {
        try {
            const { grantId } = req.params;
            
            const grant = nsfGrants.find(g => g.id.toLowerCase() === grantId.toLowerCase());
            
            if (!grant) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Grant not found'
                });
            }

            // Add additional details for specific grant
            const detailedGrant = {
                ...grant,
                fundingBreakdown: {
                    personnel: grant.awardAmount * 0.4,
                    equipment: grant.awardAmount * 0.2,
                    travel: grant.awardAmount * 0.1,
                    indirect: grant.awardAmount * 0.3
                },
                collaborators: [
                    { name: 'Dr. James Wilson', institution: 'University of California, Berkeley', role: 'Co-PI' },
                    { name: 'Dr. Lisa Anderson', institution: 'University of Michigan', role: 'Senior Researcher' }
                ],
                milestones: [
                    { title: 'Project Kickoff', date: '2024-09-01', completed: true },
                    { title: 'First Year Report', date: '2025-08-31', completed: false },
                    { title: 'Mid-term Review', date: '2026-02-28', completed: false },
                    { title: 'Final Report', date: '2027-08-31', completed: false }
                ],
                publications: [
                    { title: 'Quantum Algorithms for Climate Prediction', journal: 'Nature Climate Science', year: 2024 },
                    { title: 'Efficient Quantum Climate Models', journal: 'Physical Review Letters', year: 2023 }
                ],
                impactMetrics: {
                    citations: 15,
                    patents: 2,
                    softwareReleased: 1,
                    studentsTrained: 5,
                    outreachEvents: 12
                }
            };

            res.json({
                status: 'success',
                message: 'Grant details retrieved successfully',
                data: detailedGrant
            });
        } catch (error) {
            console.error('NSF grant details error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve grant details',
                error: error.message
            });
        }
    });

    // Search NSF Institutions
    app.get('/api/nsf/institutions/search', (req, res) => {
        try {
            const { 
                name, 
                state, 
                type, 
                specialty, 
                minAwards, 
                limit = 10 
            } = req.query;

            let results = [...nsfInstitutions];

            // Filter by name
            if (name) {
                const searchTerm = name.toLowerCase();
                results = results.filter(inst => 
                    inst.name.toLowerCase().includes(searchTerm) ||
                    inst.acronym.toLowerCase().includes(searchTerm)
                );
            }

            // Filter by state
            if (state) {
                results = results.filter(inst => 
                    inst.state.toLowerCase() === state.toLowerCase()
                );
            }

            // Filter by type
            if (type) {
                results = results.filter(inst => 
                    inst.type.toLowerCase().includes(type.toLowerCase())
                );
            }

            // Filter by specialty
            if (specialty) {
                results = results.filter(inst => 
                    inst.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
                );
            }

            // Filter by minimum awards
            if (minAwards) {
                results = results.filter(inst => inst.totalAwards >= parseInt(minAwards));
            }

            // Sort by total funding (descending)
            results.sort((a, b) => b.totalFunding - a.totalFunding);

            const limitedResults = results.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Found ${results.length} institutions matching your criteria`,
                data: {
                    institutions: limitedResults,
                    totalResults: results.length,
                    searchCriteria: { name, state, type, specialty, minAwards, limit }
                }
            });
        } catch (error) {
            console.error('NSF institution search error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Institution search failed',
                error: error.message
            });
        }
    });

    // Get NSF Funding Opportunities
    app.get('/api/nsf/opportunities', (req, res) => {
        try {
            const { 
                program, 
                discipline, 
                deadline, 
                status = 'open',
                limit = 10 
            } = req.query;

            const opportunities = [
                {
                    id: 'OPP-2024-001',
                    title: 'Quantum Information Science Research',
                    program: 'Quantum Information Science',
                    discipline: 'Computer Science',
                    description: 'Supports fundamental research in quantum computing, quantum communication, and quantum information science.',
                    fundingRange: '$500,000 - $2,000,000',
                    deadline: '2025-02-15',
                    status: 'Open',
                    eligibility: 'Universities, colleges, non-profit organizations',
                    contact: 'Dr. Alan Chen, achen@nsf.gov',
                    link: 'https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504800'
                },
                {
                    id: 'OPP-2024-002',
                    title: 'Advanced Materials for Energy Applications',
                    program: 'Materials Research',
                    discipline: 'Materials Science',
                    description: 'Supports innovative research in materials science for energy conversion and storage.',
                    fundingRange: '$750,000 - $3,000,000',
                    deadline: '2025-03-01',
                    status: 'Open',
                    eligibility: 'Research institutions, universities',
                    contact: 'Dr. Maria Garcia, mgarcia@nsf.gov',
                    link: 'https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504801'
                },
                {
                    id: 'OPP-2024-003',
                    title: 'AI and Machine Learning for Scientific Discovery',
                    program: 'Artificial Intelligence',
                    discipline: 'Computer Science',
                    description: 'Supports research at the intersection of AI/ML and scientific domains.',
                    fundingRange: '$400,000 - $1,500,000',
                    deadline: '2025-01-30',
                    status: 'Open',
                    eligibility: 'All academic institutions',
                    contact: 'Dr. Robert Kim, rkim@nsf.gov',
                    link: 'https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504802'
                }
            ];

            let results = [...opportunities];

            // Filter by program
            if (program) {
                results = results.filter(opp => 
                    opp.program.toLowerCase().includes(program.toLowerCase())
                );
            }

            // Filter by discipline
            if (discipline) {
                results = results.filter(opp => 
                    opp.discipline.toLowerCase().includes(discipline.toLowerCase())
                );
            }

            // Filter by deadline
            if (deadline) {
                results = results.filter(opp => 
                    new Date(opp.deadline) <= new Date(deadline)
                );
            }

            // Filter by status
            results = results.filter(opp => 
                opp.status.toLowerCase() === status.toLowerCase()
            );

            const limitedResults = results.slice(0, Math.min(parseInt(limit), 50));

            res.json({
                status: 'success',
                message: `Found ${results.length} funding opportunities`,
                data: {
                    opportunities: limitedResults,
                    totalResults: results.length,
                    filters: { program, discipline, deadline, status, limit }
                }
            });
        } catch (error) {
            console.error('NSF opportunities error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve funding opportunities',
                error: error.message
            });
        }
    });

    // Get NSF Statistics and Analytics
    app.get('/api/nsf/statistics', (req, res) => {
        try {
            const { year = '2024', state, discipline } = req.query;

            let relevantGrants = [...nsfGrants];

            // Apply filters
            if (state) {
                relevantGrants = relevantGrants.filter(g => g.state.toLowerCase() === state.toLowerCase());
            }
            if (discipline) {
                relevantGrants = relevantGrants.filter(g => g.discipline.toLowerCase().includes(discipline.toLowerCase()));
            }

            // Calculate statistics
            const totalGrants = relevantGrants.length;
            const totalFunding = relevantGrants.reduce((sum, g) => sum + g.awardAmount, 0);
            const averageFunding = totalGrants > 0 ? Math.round(totalFunding / totalGrants) : 0;

            // Discipline breakdown
            const disciplineStats = {};
            relevantGrants.forEach(grant => {
                if (!disciplineStats[grant.discipline]) {
                    disciplineStats[grant.discipline] = { count: 0, funding: 0 };
                }
                disciplineStats[grant.discipline].count++;
                disciplineStats[grant.discipline].funding += grant.awardAmount;
            });

            // State breakdown
            const stateStats = {};
            relevantGrants.forEach(grant => {
                if (!stateStats[grant.state]) {
                    stateStats[grant.state] = { count: 0, funding: 0 };
                }
                stateStats[grant.state].count++;
                stateStats[grant.state].funding += grant.awardAmount;
            });

            // Program breakdown
            const programStats = {};
            relevantGrants.forEach(grant => {
                if (!programStats[grant.program]) {
                    programStats[grant.program] = { count: 0, funding: 0 };
                }
                programStats[grant.program].count++;
                programStats[grant.program].funding += grant.awardAmount;
            });

            res.json({
                status: 'success',
                message: 'NSF statistics retrieved successfully',
                data: {
                    overview: {
                        year: year,
                        totalGrants: totalGrants,
                        totalFunding: totalFunding,
                        averageFunding: averageFunding,
                        filters: { state, discipline }
                    },
                    breakdown: {
                        disciplines: disciplineStats,
                        states: stateStats,
                        programs: programStats
                    },
                    trends: {
                        yearOverYearGrowth: '+12%',
                        topDisciplines: Object.keys(disciplineStats).sort((a, b) => disciplineStats[b].funding - disciplineStats[a].funding),
                        topStates: Object.keys(stateStats).sort((a, b) => stateStats[b].funding - stateStats[a].funding)
                    },
                    note: 'This is mock data. In production, connect to actual NSF API or database.'
                }
            });
        } catch (error) {
            console.error('NSF statistics error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve statistics',
                error: error.message
            });
        }
    });

    // Get NSF Research Highlights
    app.get('/api/nsf/highlights', (req, res) => {
        try {
            const { category, limit = 5 } = req.query;

            const highlights = [
                {
                    id: 'HL-2024-001',
                    title: 'Breakthrough in Quantum Computing Achieved',
                    category: 'Technology',
                    summary: 'NSF-funded researchers demonstrate quantum advantage in solving complex optimization problems.',
                    date: '2024-11-15',
                    imageUrl: 'https://picsum.photos/400/250?random=quantum',
                    grantId: 'NSF-2024-001',
                    institution: 'MIT',
                    impact: 'High'
                },
                {
                    id: 'HL-2024-002',
                    title: 'New Solar Cell Material Breaks Efficiency Records',
                    category: 'Energy',
                    summary: 'Novel perovskite materials achieve 35% efficiency in lab conditions.',
                    date: '2024-10-28',
                    imageUrl: 'https://picsum.photos/400/250?random=solar',
                    grantId: 'NSF-2024-002',
                    institution: 'Stanford',
                    impact: 'High'
                },
                {
                    id: 'HL-2024-003',
                    title: 'AI Accelerates Drug Discovery Timeline',
                    category: 'Healthcare',
                    summary: 'Machine learning models reduce drug discovery timeline from years to months.',
                    date: '2024-09-20',
                    imageUrl: 'https://picsum.photos/400/250?random=medical',
                    grantId: 'NSF-2023-156',
                    institution: 'Harvard Medical School',
                    impact: 'Medium'
                }
            ];

            let results = [...highlights];

            // Filter by category
            if (category) {
                results = results.filter(h => 
                    h.category.toLowerCase().includes(category.toLowerCase())
                );
            }

            const limitedResults = results.slice(0, Math.min(parseInt(limit), 20));

            res.json({
                status: 'success',
                message: `Found ${results.length} research highlights`,
                data: {
                    highlights: limitedResults,
                    totalResults: results.length,
                    categories: ['Technology', 'Energy', 'Healthcare', 'Environment', 'Education'],
                    filters: { category, limit }
                }
            });
        } catch (error) {
            console.error('NSF highlights error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve research highlights',
                error: error.message
            });
        }
    });
};

function getTopInstitution(grants) {
    const institutionCounts = {};
    grants.forEach(grant => {
        institutionCounts[grant.institution] = (institutionCounts[grant.institution] || 0) + 1;
    });
    return Object.keys(institutionCounts).reduce((a, b) => institutionCounts[a] > institutionCounts[b] ? a : b, '');
}