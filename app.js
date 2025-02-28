const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,
    password: process.env.DB_PASS ,
    database: process.env.DB_NAME
});

const dbconnect = db.promise();

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('database connected well');
    }
});

app.post('/register', async(req, res) => {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
            if (err) {
                res.send('doata not inserted'); 
                console.log(err);
            } else {
                res.send('Values Inserted');
            }
        }
    );
}
);

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
   
    try {
      const [rows] = await dbconnect.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).send('Cannot find user');
        }
        const user = rows[0];
        
        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(400).send('Password is incorrect');
        }

        const token = jwt.sign({id:user.id, username: user.username}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.send({token});
    } catch (err) {
        console.log(err);
    }
    
}
);


app.get('/users', (req, res) => {  
    try {
        const rows = dbconnect.query('SELECT * FROM users');
        res.send(rows);
    } catch (err) {
        console.log(err);
    }
});



const   PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

