const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
$secretkey = process.env.JWT_SECRET;
const path = require('path');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'voyage_database'
});
// const db = mysql.createConnection({
//   host: 'vn63511-001.eu.clouddb.ovh.net',
//   user: 'admin',
//   password: 't694fiBiJGgMpBLB',
//   database: 'voyage_database'
// });

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});
// Crée un jeton JWT signé contenant les informations de l'utilisateur
function generateAccessToken(user) {
  // Les données utilisateur sont stockées dans le jeton JWT
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  
  // Crée un jeton JWT en signant les données utilisateur avec une clé secrète
  const token = jwt.sign(payload, $secretkey, {
    expiresIn: '1d' // Durée de validité du jeton : 1 jour
  });
  
  return token;
}
//////////////////////////////////////////////////  CRÉATION  //////////////////////////////////////////////////
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error creating user');
      } else {
        console.log(result);
        res.status(201).send('User created successfully');
      }
    }
  );
});
//////////////////////////////////////////////////  FIN CRÉATION  //////////////////////////////////////////////////

//////////////////////////////////////////////////  LOGIN  //////////////////////////////////////////////////
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT id, email, password FROM users WHERE email = ?',
    [email],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Erreur du serveur');
      } else if (results.length === 0) {
        res.status(401).send('Adresse e-mail ou mot de passe incorrect');
      } else {
        const user = results[0];
        if (user.password === password) {
          // générer un jeton d'accès valide
          const token = generateAccessToken(user);
          res.json({ token });
        } else {
          res.status(401).send('Adresse e-mail ou mot de passe incorrect');
        }
      }
    }
  );
});

//////////////////////////////////////////////////  FIN LOGIN  //////////////////////////////////////////////////

//////////////////////////////////////////////////  GET USER INFO  //////////////////////////////////////////////////
app.get('/user-info', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    res.status(401).send('Token is missing');
    return;
  }

  jwt.verify(token, $secretkey, (err, user) => {
    if (err) {
      res.status(403).send('Invalid token');
    } else {
      db.query(
        'SELECT id, name, email FROM users WHERE id = ?',
        [user.id],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).send('Server error');
          } else if (results.length === 0) {
            res.status(404).send('User not found');
          } else {
            res.json(results[0]);
          }
        }
      );
    }
  });
});
//////////////////////////////////////////////////  FIN GET USER INFO  //////////////////////////////////////////////////
//////////////////////////////////////////////////  UPDATE USER PASSWORD  //////////////////////////////////////////////////
app.put('/update-password', (req, res) => {
  const token = req.headers['authorization'];
  const { newPassword } = req.body;

  if (!token) {
    res.status(401).send('Token is missing');
    return;
  }

  jwt.verify(token, $secretkey, (err, user) => {
    if (err) {
      res.status(403).send('Invalid token');
    } else {
      db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, user.id],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).send('Server error');
          } else {
            res.status(200).send('Password updated successfully');
          }
        }
      );
    }
  });
});
//////////////////////////////////////////////////  FIN UPDATE USER PASSWORD  //////////////////////////////////////////////////

app.listen(5001, () => {
  console.log('Server started on port 5001');
});
