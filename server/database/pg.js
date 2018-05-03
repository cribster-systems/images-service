const { Pool, Client } = require('pg');
const client = new Client();

const pool = new Pool();

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

client.connect();

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
});
