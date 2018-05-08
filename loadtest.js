// Run loadtest with loadtest npm package
const randNumInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const loadtest = require('loadtest');

function statusCallback(error, result, latency) {
  console.log('Current latency %j, result %j, error %j', latency, result, error);
  console.log('----');
  console.log('Request elapsed milliseconds: ', result.requestElapsed);
  console.log('Request index: ', result.requestIndex);
  console.log('Request loadtest() instance index: ', result.instanceIndex);
}

const options = {
  url: `http://localhost:3000/value`,
  concurreny: 1,
  maxSeconds: 20,
  requestsPerSecond: 10,
  indexParam: randNumInRange(1, 3000),
}
loadtest.loadTest(options, function(error, result) {
  if (error)
    {
      return console.error('Got an error: %s', error);
    }
    console.log('Tests run successfully');
});