const fs = require('fs');
//const fsPromises = fs.promises;
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

let makeDir = function(destination) {
  fs.mkdir(destination, {recursive: true}, (err) => {
    if(err) return console.error(err.message);
    console.log(`Directory ${destination} created`);
  });
};

let copyDir = function(source, destination) {
  fs.readdir(source,  { withFileTypes: false }, (err, files) => {
    if(err) return console.error(err.message);
    files.forEach( file => {
      const filePath = path.join(source, file);
      // rewrite file or directory to destination
      fs.stat(filePath, (err, stats) => {
        if(stats.isDirectory()) {
          makeDir(path.join(destination, file));
          console.log(`Directory ${file} successfully copied`);
          copyDir(path.join(source, file),path.join(destination, file));
        } else {
          fs.copyFile(path.join(source, file),path.join(destination, file), (err) => {
            if(err) return console.error(err.message);
            console.log(`file ${file} successfully copied`);
          });
        }
      });
    });
  });
};

let removeAll = function(destination){
  fs.readdir(destination,  (err, files) => {
    if(err) return console.error(err.message);
    files.forEach( file => {
      const filePath = path.join(destination, file);
      fs.stat(filePath, (err, stats) => {
        if(stats.isDirectory()) {
          removeAll(filePath);
        }
        fs.unlink(filePath, () => {});
      });
    });
  });
  fs.rmdir(destination, () => {});
};

removeAll(destinationPath);
makeDir(destinationPath);
copyDir(sourcePath, destinationPath);