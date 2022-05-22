const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist');
const bundle = path.join(destinationPath, 'bundle.css');

fs.writeFile(bundle, '', (err) => {
  if(err) return console.error(err.message);
});

fs.readdir(sourcePath, (err, files) => {
  files.forEach(file => {
    if(file.toLowerCase().includes('.css')){
      const styleFilePath = path.join(sourcePath, file);
      fs.readFile(styleFilePath, 'utf-8',(err, data) => {
        if(err) return console.error(err.message);
        fs.appendFile(bundle, data, (err) => {
          if(err) return console.error(err.message);
        });
      });
    }
  });
});