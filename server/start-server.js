// Temporary server starter with explicit env loading
const path = require('path');
const fs = require('fs');

// Explicitly set the working directory
process.chdir(__dirname);

// Load environment variables from the .env file in the server directory
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
  
  console.log('Environment variables loaded from .env');
} else {
  console.log('No .env file found in server directory');
}

// Now start the actual server
require('./index.js');