const Reservation = require('../models/reservation');


const confirmDeleteReservationController = async (req, res) => {
    try {
        const reservationId = req.params.id; 
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).render('error', { message: 'reservation not found' });
        }

        res.render('deleteReservation', { reservation });
    } catch (error) {
        res.render('error', { message: error.message });
    }
};

const deleteReservationController = async (req, res) => {
    try {
        const reservationId = req.params.id; 
        const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

        if (!deletedReservation) {
            return res.status(404).render('error', { message: 'reservation not found' });
        }

        res.redirect('/getreservations/get-all-reservation');
    } catch (error) {
        res.render('error', { message: error.message });
    }
};

module.exports = {
    confirmDeleteReservationController,
    deleteReservationController,
};