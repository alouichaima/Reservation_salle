const Reservation = require('../models/reservation');

const allReservationController = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('room'); 

        res.render('listeReservation', { reservations }); 
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        res.status(500).render('error', { message: 'Une erreur s\'est produite lors du traitement de votre demande.' });
    }
}

module.exports = {
    allReservationController
};
