const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
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




app.use('/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/reservations', reservationRoutes);
app.use('/getreservations', getreservationRoutes);
app.use('/editreservations', editreservationRoutes);
app.use('/deletereservation',deletereservationRoutes);

app.use('/calendar', calendarRouter);


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
