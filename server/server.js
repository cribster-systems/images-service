const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const redis = require('redis');
const responseTime = require('response-time');
const request = require('request');
require('dotenv').config();

const db = require('./database/index.js');

console.log('Updated server.js');
const app = express();
const host = process.env.NODE_ENV === 'production' ? '172.17.0.2' : '127.0.0.1';
const client = redis.createClient('6379', host);
const port = process.env.PORT || 8080;

client.on('error', function (err) {
  console.log(err);
});

client.on('connect', function () {
  console.log('Client is connected to redis server');
});

app.use(cors());
app.use(responseTime());

process.env.NODE_ENV === 'production' 
  ? app.use('/:locationId', express.static(path.join(__dirname, '../public'))) 
  : app.use('/:locationId', express.static(path.join(__dirname, '../client/dist')));

app.get('/images/:location_id', (req, res) => {
  let locationId = req.params.location_id;
  client.get(locationId, (err, result) => {
    if (result) {
      console.log('found');
      console.log(typeof result);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(result);
    } else {
      db.get(locationId, (err, images) => {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end(err);
        } else {
          let locationName = 'Location';
          let result = {locationName: locationName, images: images};
          client.setex(locationId, 120, JSON.stringify(result));
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(result));       
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});