const Reservation = require('../models/reservation');



const editReservationController = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            console.log('Pas de reservation');
            return res.status(404).render('error', { message: 'Pas de reservation' });
        }

        res.render('editReservation', { reservation });
    } catch (error) {
        console.error('Erreur lors de la récupération de la reservation pour édition :', error);
        res.status(500).render('error', { message: 'Erreur interne du serveur' });
    }
};

const updateReservationController = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const { startTime, endTime } = req.body;
        
      

        const updatedReservation= await Reservation.findByIdAndUpdate(reservationId, {startTime,  endTime }, { new: true });

        if (!updatedReservation) {
            return res.status(404).render('error', { message: 'Reservation not found' });
        }

        res.redirect('getreservations/get-all-reservation');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la salle :', error);
        res.status(500).render('error', { message: 'Erreur interne du serveur' });
    }
};
module.exports = {
    
    editReservationController   ,
    updateReservationController

};