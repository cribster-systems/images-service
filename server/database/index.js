const mongoose = require('mongoose');
const _ = require('lodash');
const { MLAB_USERNAME, MLAB_PASSWORD } = process.env;

// mongoose.connect(`mongodb://${MLAB_USERNAME}:${MLAB_PASSWORD}@ds241039.mlab.com:41039/fantasybnb`);
mongoose.connect('mongodb://localhost/images');
const db = mongoose.connection;

let counterSchema = mongoose.Schema({
  id: String,              // location_id
  totalListings: Number,    // Counter to hold total number of listings in db
  listingsDeleted: Number   // Counter to hold total number of deleted listings
});

// Image documents will refer to the counter collection for their sequential loc_id
// counter collection currently created in mongo shell 
let imageSchema = mongoose.Schema({
  location_id: {
    type: Number,
    index: true,
    unique: true
  },
  caption: String, 
  src: Array
});

let Image   = mongoose.model('Image', imageSchema);
let Counters = mongoose.model('Counter', counterSchema);

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
// This also updates the listing count whenever invoked await getNextSequenceValue("location_id");
const getNextSequenceValue = (sequenceName) => {
  let sequenceDocument = Counters.findOneAndUpdate({ id: sequenceName },{ $inc: { totalListings:1 } },{new: true},                         // returns newly udpated doc to db
     (err, res) => {
      if(err) return console.log(err);
      console.log('Total listings count incremented');
     }
  );
  console.log( sequenceDocument.numListing );
};

// This should be invoked when a batch was inserted in the db
// Rather than updating every insert, let's update the total after the batch was inserted
const updateSequenceValue = (numCreated) => {
  Counters.findOneAndUpdate({ id: sequenceName },{ $inc: { totalListings:numCreated } },{new: true});
};

module.exports = {
  db: db,
  mongoose: mongoose,
  Image: Image,
  Counters: Counters,
  getNextSequenceValue: getNextSequenceValue,
  updateSequenceValue: updateSequenceValue,
  get: get
};