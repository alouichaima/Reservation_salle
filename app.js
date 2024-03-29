const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); 

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
app.set('views', path.join(__dirname, 'views'));

app.use('/auth', authRoutes);

const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);


app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))


const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;


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
