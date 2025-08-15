const fs = require('fs');
const path = require('path');
const newVersion = process.env.npm_package_version;
const envFilePath = path.resolve(__dirname, '../backend/.env');

if (!newVersion) {
    console.error('Error: Could not find new version.');
    process.exit(1);
}

try {
    let envContent = fs.readFileSync(envFilePath, 'utf8');

    const updatedContent = envContent.replace(/^APP_VERSION=.*$/m, `APP_VERSION=${newVersion}`);

    fs.writeFileSync(envFilePath, updatedContent);

    console.log(`Updated APP_VERSION to "${newVersion}" in .env file.`);

    const { execSync } = require('child_process');
    execSync(`git add ${envFilePath}`);
    console.log('Staged .env file for commit.');
} catch (error) {
    console.error(`Error updating .env file: ${error.message}`);
    process.exit(1);
}
