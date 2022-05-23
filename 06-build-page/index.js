const fs = require('fs');
const path = require('path');

const sourceStylesPath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist');
const bundle = path.join(destinationPath, 'style.css');
const assetsSource = path.join(__dirname, 'assets');
const assetsDestination = path.join(destinationPath, 'assets');

let makeDir = function (destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) return console.error(err.message);
    console.log(`Directory ${destination} created`);
  });
};

let copyDir = function (source, destination) {
  fs.readdir(source, { withFileTypes: false }, (err, files) => {
    if (err) return console.error(err.message);
    files.forEach(file => {
      const filePath = path.join(source, file);
      // rewrite file or directory to destination
      fs.stat(filePath, (err, stats) => {
        if (stats.isDirectory()) {
          makeDir(path.join(destination, file));
          console.log(`Directory ${file} successfully copied`);
          copyDir(path.join(source, file), path.join(destination, file));
        } else {
          fs.copyFile(path.join(source, file), path.join(destination, file), (err) => {
            if (err) return console.error(err.message);
            console.log(`file ${file} successfully copied`);
          });
        }
      });
    });
  });
};

makeDir(destinationPath);
makeDir(assetsDestination);
copyDir(assetsSource, assetsDestination);

fs.writeFile(bundle, '', (err) => {
  if (err) return console.error(err.message);
});

fs.readdir(sourceStylesPath, (err, files) => {
  files.forEach(file => {
    if (file.toLowerCase().includes('.css')) {
      const styleFilePath = path.join(sourceStylesPath, file);
      fs.readFile(styleFilePath, 'utf-8', (err, data) => {
        if (err) return console.error(err.message);
        fs.appendFile(bundle, data, (err) => {
          if (err) return console.error(err.message);
        });
      });
    }
  });
});



// if(str.includes({{header}})) str.replace('{{header}}', ./components/header.html);
// if(str.includes({{main}})) str.replace('{{header}}', ./components/main.html);
// if(str.includes({{footer}})) str.replace('{{header}}', ./components/footer.html);

// https://ru.stackoverflow.com/questions/495212/%D0%9A%D0%B0%D0%BA-%D1%81%D1%87%D0%B8%D1%82%D0%B0%D1%82%D1%8C-%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D1%91%D0%BD%D0%BD%D1%83%D1%8E-%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8E-%D0%B8%D0%B7-%D1%84%D0%B0%D0%B9%D0%BB%D0%B0-%D0%B8-%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B8%D1%82%D1%8C-%D0%B5%D1%91-%D0%BD%D0%B0-%D0%B4%D1%80%D1%83%D0%B3%D1%83%D1%8E