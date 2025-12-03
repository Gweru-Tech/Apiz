const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test utility function
async function testEndpoint(name, method, url, data = null) {
    console.log(`\n🧪 Testing ${name}...`);
    try {
        let response;
        if (method === 'GET') {
            response = await axios.get(`${BASE_URL}${url}`);
        } else if (method === 'POST') {
            response = await axios.post(`${BASE_URL}${url}`, data);
        }
        
        console.log(`✅ ${name} - Status: ${response.status}`);
        console.log(`📊 Response:`, JSON.stringify(response.data, null, 2));
        return true;
    } catch (error) {
        console.log(`❌ ${name} - Error: ${error.message}`);
        if (error.response) {
            console.log(`📊 Error Response:`, JSON.stringify(error.response.data, null, 2));
        }
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting Hookrest API Tests...');
    console.log(`📡 Testing against: ${BASE_URL}`);
    
    const tests = [
        // Health Check
        ['Health Check', 'GET', '/health'],
        
        // API Documentation
        ['API Documentation', 'GET', '/api/docs'],
        
        // YouTube Search
        ['YouTube Search', 'GET', '/api/youtube/search?query=nodejs'],
        
        // QR Code Generation
        ['QR Code Generation', 'POST', '/api/qrcode/generate', { text: 'https://example.com', size: 200 }],
        
        // Text Utilities
        ['Text Utilities', 'POST', '/api/tools/text', { text: 'Hello World' }],
        
        // JSON Utilities
        ['JSON Validation', 'POST', '/api/tools/json', { json: '{"test": "value"}', operation: 'validate' }],
        
        // URL Utilities
        ['URL Parsing', 'POST', '/api/tools/url', { url: 'https://example.com/path?query=value' }],
        
        // Base64 Encode
        ['Base64 Encode', 'POST', '/api/tools/base64', { text: 'Hello World', operation: 'encode' }],
        
        // Weather Info
        ['Weather Current', 'GET', '/api/weather/current?city=London'],
        
        // Weather Forecast
        ['Weather Forecast', 'GET', '/api/weather/forecast?city=New York&days=3'],
        
        // URL Shortener
        ['URL Shortener', 'POST', '/api/urlshortener/shorten', { url: 'https://example.com/very-long-url' }],
        
        // URL Shortener List
        ['URL Shortener List', 'GET', '/api/urlshortener/list']
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (const [name, method, url, data] of tests) {
        const passed = await testEndpoint(name, method, url, data);
        if (passed) passedTests++;
    }
    
    console.log(`\n📈 Test Results:`);
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log(`\n🎉 All tests passed! Your API is working perfectly.`);
    } else {
        console.log(`\n⚠️ Some tests failed. Please check the errors above.`);
    }
}

// Error handling for uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };