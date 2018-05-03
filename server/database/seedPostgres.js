// This program will write csv data to a file, and then insert that data into Postgres
const fs = require('fs');

const writeToFile = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile('message.txt', 'Hello Node.js', (err) => {
      if (err) { reject(err); }
      else {
        resolve('The file has been saved!');
      }
    });
  })
}

writeToFile()
.then((text) => { console.log(text); })
.catch((err) => console.log('FUCK', err));;
