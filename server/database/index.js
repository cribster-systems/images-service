const mongoose = require('mongoose');
const _ = require('lodash');
const { MLAB_USERNAME, MLAB_PASSWORD } = process.env;

// mongoose.connect(`mongodb://${MLAB_USERNAME}:${MLAB_PASSWORD}@ds241039.mlab.com:41039/fantasybnb`);
mongoose.connect('mongodb://localhost/images');
const db = mongoose.connection;

let counterSchema = mongoose.Schema({
  id: String, // 'location_id'
  totalListings: Number,
  listingsDeleted: Number
});

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

// Returns next lext listing ID and updates counter
const getNextSequenceValue = () => {
  let sequenceDocument = Counters.findOneAndUpdate({ id: 'location_id' },{ $inc: { totalListings:1 } },{new: true},
     (err, res) => {
      if(err) return console.log(err);
      return res.totalListings;
     }
  );
};

// *** Only to be used for seeding db atm *** When inserting a batch, update counter post-insertion.
const updateSequenceValue = (numCreated) => {
  Counters.findOneAndUpdate({ id: 'location_id' },{ $inc: { totalListings: numCreated } },{new: true},
    (err, res) => { if (err) return console.log(err); console.log(res);}
  );
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