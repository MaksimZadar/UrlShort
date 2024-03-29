const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://whshytkh:9ENGrZYYjqVH0Xd7u-ELpF8y22jxp83K@rosie.db.elephantsql.com/whshytkh'
});

client.connect();
const app = express();
app.use('/', express.static('public'))
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'))

function getRandom(){
  return Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 4);
}

app.get('/generate', (req, res)=>{
  let short = getRandom()
  let long = req.query.url;
  let time = new Date().getTime();
  let date = new Date(time + 259200000);

  const text = `insert into short_urls(short, long, time_to_delete) values($1, $2, $3)`;
  const values = [short, long, date];
  
  client
  .query(text, values)
  .catch(e => console.error(e.stack))
  res.json({
    url: short
  })
})

app.get('/:short', (req, res)=>{

  let text = `select long from short_urls where short = $1`
  let values = [req.params.short]

  client.query(text, values)
    .then(resp => res.redirect(resp.rows[0].long))
    .catch(e => console.error(e.stack))
})

app.listen(3000)
