const { db, mongoose, Image } = require('./index.js');
const faker = require('faker');
const imgUrl = 'https://s3-us-west-1.amazonaws.com/images-service-images/pic'; //pic<1-270>.jpg';
// Generates list of image urls for each listing
const randNumInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randImageArray = () => {
  let arr = [];
  for (let j = 0; j < randNumInRange(2, 5); j += 1) {
    arr.push(imgUrl + randNumInRange(1, 270) + '.jpg');
  }
  return arr;
}

// Please keep arms and legs inside the vehicle at all times...
var count = 0;
async function seeder() {
  for (let i = 0; i < 1000; i += 1) {
    let batch = [];
    for (let j = 0; j < 10000; j += 1) {
      let newEntry = {
        location_id: count,
        caption: faker.lorem.sentence(),
        src: randImageArray()
      }
      batch.push(newEntry);
      count += 1;
    }
    await Image.insertMany(batch);
  }
}

seeder();
