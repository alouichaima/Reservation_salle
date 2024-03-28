const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const app = express();

// Utilisation du middleware de session
app.use(session({
  secret: 'your_secret_key', // Changez ceci par une clé secrète plus sécurisée
  resave: false,
  saveUninitialized: false
}));

dotenv.config();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Définir le répertoire des vues
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware pour traiter les données de formulaire

// Définir les routes d'authentification
app.use('/auth', authRoutes);

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// Définir les variables d'environnement
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;



app.get('/auth/register', (req, res) => {
    const error = null;
    res.render('register', { error: error });
});

app.get('/auth/login', (req, res) => {
    const error = null;
    res.render('base', { error: error });
});

// Route pour afficher le tableau de bord
app.get('/auth/dashboard', (req, res) => {
  res.render('dashboard'); // C'est juste un exemple, vous devez implémenter la logique appropriée ici
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
