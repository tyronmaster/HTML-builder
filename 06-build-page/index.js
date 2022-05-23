const fs = require('fs');
const path = require('path');

const sourceStylesPath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist');
const bundle = path.join(destinationPath, 'style.css');
const index = path.join(destinationPath, 'index.html');
const assetsSource = path.join(__dirname, 'assets');
const assetsDestination = path.join(destinationPath, 'assets');
const components = path.join(__dirname, 'components');
// const header = 'header';
// const articles = 'articles';
// const main = 'main';
// const footer = 'footer';

let makeDir = function (destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) return console.error(err.message);
    //console.log(`Directory ${destination} created`);
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
          //console.log(`Directory ${file} successfully copied`);
          copyDir(path.join(source, file), path.join(destination, file));
        } else {
          fs.copyFile(path.join(source, file), path.join(destination, file), (err) => {
            if (err) return console.error(err.message);
            //console.log(`file ${file} successfully copied`);
          });
        }
      });
    });
  });
};

makeDir(destinationPath);
makeDir(assetsDestination);
copyDir(assetsSource, assetsDestination);


// create style.css
fs.writeFile(bundle, '', (err) => {
  if (err) return console.error(err.message);
});

fs.readdir(sourceStylesPath, (err, files) => {
  // sort files
  files.push(files.shift());

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

// create index.html
fs.writeFile(index, '', (err) => {
  if (err) return console.error(err.message);
});

fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
  if (err) console.log(err);
  let template = data;

  fs.readFile(path.join(components, 'header.html'), 'utf-8', (err, data) => {
    template = template.replace('{{header}}', data);
    fs.writeFile(index, template, (err) => {
      if (err) return console.error(err.message);
    });
  });

  fs.readFile(path.join(components, 'articles.html'), 'utf-8', (err, data) => {
    template = template.replace('{{articles}}', data);
    fs.writeFile(index, template, (err) => {
      if (err) return console.error(err.message);
    });
  });

  fs.readFile(path.join(components, 'footer.html'), 'utf-8', (err, data) => {
    template = template.replace('{{footer}}', data);
    fs.writeFile(index, template, (err) => {
      if (err) return console.error(err.message);
    });
  });
});