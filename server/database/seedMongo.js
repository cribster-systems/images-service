const { db, mongoose, Image, getNextSequenceValue, updateSequenceValue, Counters } = require('./index.js');
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

async function createCounter() {
  await Counters.create( {id: "location_id" , totalListings: 0 , listingsDeleted: 0 } );
}

// Please keep arms and legs inside the vehicle at all times...
let count = 0;
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
    if(count % 10000 === 0) {
      console.log(count);
    }
    if(count === 10000000) {
      console.log('10 mil entries seeded');
    }
  }
  //updateSequenceValue(count);
}
// try { setTimeout(createCounter, 5000); } 
// catch(error) { console.log('Failed at createCounter ' + error); }
seeder();
// try { setTimeout(seeder, 10000); } 
// catch(error) { console.log('Failed at seeder ' + error); }
// createCounter();
// seeder();
