// Fixed API Route Loader
let totalRoutes = 0;
const apiFolder = path.join(__dirname, './src/api');

try {
    if (fs.existsSync(apiFolder)) {
        fs.readdirSync(apiFolder).forEach((file) => {
            const filePath = path.join(apiFolder, file);
            const stat = fs.statSync(filePath);
            
            // Handle subdirectories
            if (stat.isDirectory()) {
                fs.readdirSync(filePath).forEach((subFile) => {
                    if (path.extname(subFile) === '.js') {
                        try {
                            require(path.join(filePath, subFile))(app);
                            totalRoutes++;
                            console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${file}/${subFile} `));
                        } catch (error) {
                            console.error(chalk.red(`Error loading route ${file}/${subFile}:`, error.message));
                        }
                    }
                });
            } 
            // Handle direct .js files in api folder
            else if (path.extname(file) === '.js') {
                try {
                    require(filePath)(app);
                    totalRoutes++;
                    console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${file} `));
                } catch (error) {
                    console.error(chalk.red(`Error loading route ${file}:`, error.message));
                }
            }
        });
    } else {
        console.log(chalk.yellow('API folder not found, creating it...'));
        fs.mkdirSync(apiFolder, { recursive: true });
    }
} catch (error) {
    console.error(chalk.red('Error loading API routes:', error.message));
}
