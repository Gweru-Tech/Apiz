
// Test API file: src/api/test.js
// Place this file in your src/api/ folder to test if route loading works

module.exports = function(app) {
    // Test endpoint
    app.get('/api/test', (req, res) => {
        res.json({
            message: 'Test API is working!',
            status: 'success',
            data: {
                timestamp: new Date().toISOString(),
                test: true
            }
        });
    });

    // Another test endpoint
    app.get('/api/test/hello', (req, res) => {
        res.json({
            message: 'Hello from test API!',
            status: 'success'
        });
    });

    console.log('Test API loaded successfully');
};
