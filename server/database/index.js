const mongoose = require('mongoose');
const _ = require('lodash');

const { MLAB_USERNAME, MLAB_PASSWORD } = process.env;
console.log(process.env.NODE_ENV);

// mongoose.connect(`mongodb://${MLAB_USERNAME}:${MLAB_PASSWORD}@ds241039.mlab.com:41039/fantasybnb`);
mongoose.connect('mongodb://localhost/images');
const db = mongoose.connection;

let imageSchema = mongoose.Schema({
  location_id: Number,
  caption: String, 
  src: Array
});

let Image = mongoose.model('Image', imageSchema);

let get = function(locationId, cb) {
  Image.find({ "location_id": locationId}).exec()
    .then((results) => {
      cb(null, results); 
    })
    .catch((err) => {
      cb(err, null);
    });
};

module.exports = {
  db: db,
  mongoose: mongoose,
  Image: Image,
  get: get
};