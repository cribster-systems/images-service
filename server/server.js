const cors         = require('cors');
const path         = require('path');
const redis        = require('redis');
const faker        = require('faker');
const express      = require('express');
const request      = require('request');
const bodyParser   = require('body-parser');
const responseTime = require('response-time');
const { randImageArray } = require('./database/seedMongo.js');
const { db, insert, getNextSequenceValue } = require('./database/index.js');
const port = process.env.PORT || 3000;
const host = process.env.NODE_ENV === 'production' ? '172.17.0.2' : '127.0.0.1';
const newRelic = require('newrelic');
const client = redis.createClient('6379', host);
const app = express();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
require('dotenv').config();

app.use(cors());
app.use(responseTime());

// Node cluster allows machine to utilize all cpu cores
// mostly reduces load on single core, and increased performance
if(cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i +=1) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {

client.on('error', () => console.log(err));
client.on('connect', () => console.log('Client is connected to redis server'));

process.env.NODE_ENV === 'production' 
  ? app.use('/:locationId', express.static(path.join(__dirname, '../public'))) 
  : app.use('/:locationId', express.static(path.join(__dirname, '../client/dist')));

app.get('/images/:location_id', (req, res) => {
  let locationId = req.params.location_id;
  client.get(locationId, (err, result) => {
    if (result) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(result);
    } else {
      db.get(locationId, (err, images) => {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end(err);
        } else {
          let result = {locationName: 'location', images: images};
          client.setex(locationId, 120, JSON.stringify(result));
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(result));       
        }
      });
    };
  });
});

const imgUrl = 'https://s3-us-west-1.amazonaws.com/images-service-images/pic'; //pic<1-270>.jpg';
app.post('/insert/', (req, res) => {
  async function makeEntry() {
    await getNextSequenceValue((err, res) => {
      if(err) return console.log(err);
      let newEntry = {
        location_id: res-1,
        caption: faker.lorem.sentence(),
        src: randImageArray()
      }
      insert(newEntry);
    });
  }
  makeEntry();
});

// Connections will remain open for 20seconds,this will enable faster transations between host and client
// Is this realistic, though? 
// app.on('connection', (socket) => {
//   socket.setTimeout(20 * 1000);
// });

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
  
}
