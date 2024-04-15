const Reservation = require('../models/reservation');

const allReservationController = async (req, res) => {
    try {
        // Récupérer toutes les réservations de la base de données
        const reservations = await Reservation.find().populate('room'); // Assurez-vous de peupler la référence de la chambre

        // Rendre la vue "reservation.ejs" en lui passant les données des réservations
        res.render('listeReservation', { reservations }); // Utilisez le bon nom de fichier de vue
    } catch (error) {
        console.error('Une erreur s\'est produite :', error); // Log de l'erreur pour le débogage
        res.status(500).render('error', { message: 'Une erreur s\'est produite lors du traitement de votre demande.' });
    }
}

module.exports = {
    allReservationController
};
