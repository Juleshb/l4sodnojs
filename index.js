const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const app = express()
const port = 5200

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello Wor')
});

app.get('/user', async(req, res) => {

  const [rows] = await db.query('SELECT * FROM Users');
  res.send(rows);
    
    
});

app.post('/user', async(req, res) => {  
const {name, email, password} = req.body;

if (!name || !email || !password) {
    return res.status(400).json({message: 'Bad Request'});
  
}
  const [rows] = await db.query('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [name, email, password ]);

  return res.status(201).json({message: 'User created'});

  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})