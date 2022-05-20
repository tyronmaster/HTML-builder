const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: false }, (err, files) => {
  if (err) return console.error(err.message);
  console.log('Target directory filenames:');
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        const fileObject = path.parse(filePath);
        console.log(`${fileObject.name} - ${fileObject.ext.slice(1)} - ${stats.size} bytes`);
      }
    });
  });
});