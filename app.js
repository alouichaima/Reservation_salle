// App.js

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer'); // Importer Multer

const reservationRoutes = require('./routes/reservationRoutes');
const getreservationRoutes = require('./routes/getreservationRoutes'); 
const editreservationRoutes = require('./routes/editreservationRoutes'); 
const deletereservationRoutes = require('./routes/deletereservationRoutes'); 
const calendarRouter = require('./routes/calendarRoutes');

const app = express();

// Utilisation du middleware de session et de cookie-parser
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
app.use('/fullcalendar', express.static(path.join(__dirname, 'public/assets/fullcalendar')));

// Configuration de Multer pour gérer les fichiers téléchargés
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Spécifiez le dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Utilisez le nom de fichier d'origine
    }
});

const upload = multer({ storage: storage });

// Utilisez Multer pour le champ de fichier image dans le formulaire
app.use(upload.single('image'));

app.use('/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/reservations', reservationRoutes);
app.use('/getreservations', getreservationRoutes);
app.use('/editreservations', editreservationRoutes);
app.use('/deletereservation',deletereservationRoutes);
app.use('/calendar', calendarRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Autres middlewares et configurations...

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database');
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
    .catch(err => {
        console.log('Error connecting to database:', err.message);
    });
