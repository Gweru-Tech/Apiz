// Debug script to check your API routes loading
const fs = require('fs');
const path = require('path');

const apiFolder = path.join(__dirname, './src/api');

console.log('=== API Route Debug Tool ===');
console.log(`Looking for API folder at: ${apiFolder}`);
console.log(`API folder exists: ${fs.existsSync(apiFolder)}`);

if (fs.existsSync(apiFolder)) {
    console.log('\nContents of API folder:');
    try {
        const files = fs.readdirSync(apiFolder);
        console.log(files);
        
        files.forEach((file) => {
            const filePath = path.join(apiFolder, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                console.log(`\nSubdirectory: ${file}`);
                const subFiles = fs.readdirSync(filePath);
                console.log('  Contents:', subFiles);
                subFiles.forEach((subFile) => {
                    if (path.extname(subFile) === '.js') {
                        console.log(`  ✓ JS file: ${subFile}`);
                    }
                });
            } else if (path.extname(file) === '.js') {
                console.log(`✓ JS file: ${file}`);
            } else {
                console.log(`- Other file: ${file}`);
            }
        });
    } catch (error) {
        console.error('Error reading API folder:', error.message);
    }
} else {
    console.log('\nAPI folder does not exist. Creating it...');
    try {
        fs.mkdirSync(apiFolder, { recursive: true });
        console.log('API folder created successfully');
    } catch (error) {
        console.error('Error creating API folder:', error.message);
    }
}

console.log('\n=== Check completed ===');
