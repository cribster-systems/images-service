const mongoose = require('mongoose');
const _ = require('lodash');

const { MLAB_USERNAME, MLAB_PASSWORD } = process.env;
console.log(process.env.NODE_ENV);

// mongoose.connect(`mongodb://${MLAB_USERNAME}:${MLAB_PASSWORD}@ds241039.mlab.com:41039/fantasybnb`);
mongoose.connect('mongodb://localhost/images');
const db = mongoose.connection;

let counterSchema = mongoose.Schema({
  _id: String,              // location_id
  totalListings: Number,    // Counter to hold total number of listings in db
  listingsDeleted: Number   // Counter to hold total number of deleted listings
});

// Image documents will refer to the counter schema for their sequential loc_id
let imageSchema = mongoose.Schema({
  location_id: {
    type: Number,
    index: true,
    unique: true
  },
  caption: String, 
  src: Array
});

let Image = mongoose.model('Image', imageSchema);
let Counter = mongoose.model('Counter', counterSchema);

const get = function(locationId, cb) {
  Image.find({ "location_id": locationId}).exec()
    .then((results) => {
      cb(null, results); 
    })
    .catch((err) => {
      cb(err, null);
    });
};

// When creating a new listing, get the latest location_id with this method.
// This also updates the listing count whenever invoked
const getNextSequenceValue = (sequenceName) => {
  let sequenceDocument = db.Counter.findOneAndUpdate({
     query:{_id: sequenceName },        // sequenceName should be listing_id
     update: {$inc:{sequence_value:1}}, // incremenets value by 1
     new: true                          // returns newly udpated doc to db
  });
  return sequenceDocument.sequence_value;
}

module.exports = {
  db: db,
  mongoose: mongoose,
  Image: Image,
  Counter,
  getNextSequenceValue: getNextSequenceValue,
  get: get
};