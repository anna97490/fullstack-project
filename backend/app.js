const express = require('express');
const app = express();
const helmet = require('helmet');
const path = require('path');
const db = require('./config/database');
require('dotenv').config();

// Routers
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

// Connexion à la base de donnée
db.sync()
.then(console.log('Connected to the Database!'))
.catch(error => console.log(error));

// Accès au corps de la req
app.use(express.json());

// Sécurisation des en-têtes HTTP
app.use(helmet());

// Ajout des headers à l'objet réponse
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_URL}`);
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });
  
// Les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

module.exports = app;