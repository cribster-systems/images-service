// This program will write csv data to a file, and then insert that data into Postgres
const fs = require('fs');
const faker = require('faker');
const imgUrl = 'https://s3-us-west-1.amazonaws.com/images-service-images/pic'; //pic<1-270>.jpg';

const randNumInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randImageUrl = () => {
  return(imgUrl + randNumInRange(1, 270) + '.jpg');
}

const writeToFile = (batch) => {
  return new Promise((resolve, reject) => {
    fs.appendFile('seed.csv', batch, 'utf8',  (err) => {
      if (err) { reject(err); }
      else {
        resolve('The file has been saved!');
      }
    });
  })
}

const generateListingEntry = (listingNum) => {
  let listingEntry = '';
  let randNum = randNumInRange(2,5);
  for (let x = 0; x < randNum; x += 1) {
    listingEntry += `${faker.lorem.sentence()},${randImageUrl()},${listingNum}\n`;
  }
  return listingEntry;
}

let numId = 1;
async function generateCSV() {
  for(let i = 0; i < 1000; i +=1) {
    let batch = '';
    for(let j = 0; j < 10000; j += 1) {
      let listing = generateListingEntry(numId);
      batch += listing;
      numId += 1;
    }
    await writeToFile(batch)
      .then((success) => console.log(`Successfully wrote batch #${i} to file`))
      .catch((err) => console.log('Error', err));
  }
}

generateCSV();
