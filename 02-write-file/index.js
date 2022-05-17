const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = require('process');
const process = require('process');
//const readline = require('readline');
const fileName = 'text.txt';

const myWriteStream = fs.createWriteStream(path.join(__dirname, fileName), 'utf-8');
stdout.write('Hi! Type your text to be saved in file\n');

stdin.on('data', data => {
  const keywordPosition = data.toString().indexOf('exit');
  if(keywordPosition !== -1){
    myWriteStream.write(data.toString().slice(0, keywordPosition));
    exit();
  }
  myWriteStream.write(data);
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('File complete.'));