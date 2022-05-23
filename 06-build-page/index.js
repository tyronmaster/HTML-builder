const fs = require('fs');
const path = require('path');

const sourceStylesPath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist');
const bundle = path.join(destinationPath, 'style.css');
const index = path.join(destinationPath, 'index.html');
const assetsSource = path.join(__dirname, 'assets');
const assetsDestination = path.join(destinationPath, 'assets');
const components = path.join(__dirname, 'components');

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

fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
  if (err) return console.error(err.message);
  let template = data;
  let tags = template.match(/\{\{[a-zA-Z]+\}\}/g);
  tags.forEach( tag => {
    tag = tag.slice(2, -2);

    fs.readFile(path.join(components, `${tag}.html`), 'utf-8', (err, data) => {
      if (err) return console.error(err.message);
      template = template.replace(`{{${tag}}}`, data);
      fs.writeFile(index, template, (err) => {
        if (err) return console.error(err.message);
      });
    });
  });
});



// create style.css
fs.writeFile(bundle, '', (err) => {
  if (err) return console.error(err.message);
  //console.log('Styles file cleared');
  fs.readdir(sourceStylesPath, (err, files) => {
    // sort files
    files.push('footer.css');
    files.splice(files.indexOf('footer.css', 0), 1);
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
});