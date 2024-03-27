const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Définir le répertoire des vues
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware pour traiter les données de formulaire

// Définir les routes d'authentification
app.use('/auth', authRoutes);

// Définir d'autres routes ou middleware si nécessaire...

// Définir les variables d'environnement
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

app.get('/auth/register', (req, res) => {
    const error = null;
    res.render('register', { error: error });
});

app.get('/auth/login', (req, res) => {
    const error = null;
    res.render('login', { error: error });
});


// Connect to the database
mongoose.connect(MONGODB_URI, { dbName: 'reservation_salle', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Error connecting to database:', err.message);
});
