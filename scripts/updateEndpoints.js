const fs = require('fs');
const path = require('path');

const directoriesToSearch = [
  path.resolve(__dirname, '../src/pages'),
  path.resolve(__dirname, '../src/components'),
  path.resolve(__dirname, '../src/context'),
];

const localEndpoint = 'http://localhost:5000';
const newEndpoint = 'https://journety-craft-backend.onrender.com';

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has any API calls to update
    if (content.includes(localEndpoint)) {
      console.log(`Updating ${filePath}`);
      
      // Update direct API calls
      let updatedContent = content.replace(
        new RegExp(localEndpoint, 'g'),
        newEndpoint
      );
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
    }
  } catch (err) {
    console.error(`Error updating ${filePath}:`, err);
  }
}

function scanDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      scanDirectory(itemPath);
    } else if (stats.isFile() && (itemPath.endsWith('.js') || itemPath.endsWith('.jsx'))) {
      updateFile(itemPath);
    }
  }
}

// Start scanning directories
directoriesToSearch.forEach(dir => scanDirectory(dir));
console.log('Endpoint update completed!');