const { db, mongoose, Image } = require('./index.js');
let count = 0;

// Seeds 10 million entries
async function seeder() {
  for (let i = 0; i < 1000; i += 1) {
    let batch = [];
    for (let j = 0; j < 10000; j += 1) {
      let newEntry = {
        src: count
      }
      batch.push(newEntry);
      count += 1;
    }
    await Image.insertMany(batch);
  }
}

seeder();
