const fs = require('fs');
const path = require('path');
const fileName = 'text.txt';

// Simple variant
/*
fs.readFile(path.join(__dirname, 'text.txt'), 'utf-8', (err, data) => {
  if (err) console.log(err);
  console.log(data);
});
*/

// Variant with Stream

const myReadStream = fs.createReadStream(path.join(__dirname, fileName), 'utf-8');
myReadStream.on('data', (chunk) => {
  console.log(`Chunk or total file ${path.join(__dirname, fileName)} received :`);
  console.log(chunk);
});