const express = require('express')
const db = require('./db')
const app = express()
const port = 5200

app.get('/', (req, res) => {
  res.send('Hello Wor')
});

app.get('/user', async(req, res) => {

  const [rows] = await db.query('SELECT * FROM Users');
  res.send(rows);
    
    
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})