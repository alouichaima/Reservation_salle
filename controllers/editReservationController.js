const nodemailer = require('nodemailer'); 

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

        const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, { startTime, endTime }, { new: true });

        if (!updatedReservation) {
            return res.status(404).render('error', { message: 'Reservation not found' });
        }

        sendConfirmationEmail(updatedReservation);

        res.redirect('/getreservations/get-all-reservation');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la salle :', error);
        res.status(500).render('error', { message: 'Erreur interne du serveur' });
    }
};

const sendConfirmationEmail = (reservation) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'oumaimaguedri66@gmail.com',
            pass: 'uodg lyfg dnkc gacf'
        }
    });

    const mailOptions = {
        from: 'oumaimaguedri66@gmail.com',
        to: 'oumaimaguedri66@gmail.com', 
        subject: 'Modification de réservation confirmée',
        text: `Votre réservation a été modifiée avec succès. Nouvelle heure de début : ${reservation.startTime}, Nouvelle heure de fin : ${reservation.endTime}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        } else {
            console.log('E-mail de confirmation envoyé :', info.response);
        }
    });
};

module.exports = {
    editReservationController,
    updateReservationController
};
