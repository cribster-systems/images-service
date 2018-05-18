const mongoose = require('mongoose');
require('dotenv').config();
const { MLAB_USERNAME, MLAB_PASSWORD } = process.env;

// mongoose.connect(`mongodb://${MLAB_USERNAME}:${MLAB_PASSWORD}@ds241039.mlab.com:41039/fantasybnb`);
// WHEN DOCKERIZING
//mongoose.connect('mongodb://172.17.0.2:27017/images');
// WHEN COMPOSING
//mongoose.connect('mongodb://ec2-52-53-236-220.us-west-1.compute.amazonaws.com/images');
//////////////////
//mongoose.connect('mongodb://localhost/images');

const host = process.env.NODE_ENV = 'production'
  ? 'mongodb://ec2-52-53-177-93.us-west-1.compute.amazonaws.com/images'
  : 'mongodb://ec2-52-53-177-93.us-west-1.compute.amazonaws.com/images';
  
mongoose.connect(host);
console.log('Connecting to Mongo host @ ' + host);

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

let Image = mongoose.model('Image', imageSchema);
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

const insert = (entity) => {
  Image.create(entity, (err, res) => {
    if(err) return console.log(err);
    console.log('Entity successfully inserted');
  });
};

// Returns next lext listing ID and updates counter
const getNextSequenceValue = (cb) => {
  Counters.findOneAndUpdate(
    { id: 'location_id' },
    { $inc: { totalListings:1 } },
    {new: true},
    (err, res) => {
      if(err)  cb(err, null);
      return cb(null, res.totalListings);
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
  get: get,
  Image: Image,
  insert: insert,
  mongoose: mongoose,
  Counters: Counters,
  updateSequenceValue: updateSequenceValue,
  getNextSequenceValue: getNextSequenceValue,
};