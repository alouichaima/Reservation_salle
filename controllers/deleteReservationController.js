const Reservation = require('../models/reservation');
const nodemailer = require('nodemailer'); 

const confirmDeleteReservationController = async (req, res) => {
    try {
        const reservationId = req.params.id; 
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).render('error', { message: 'Reservation not found' });
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
            return res.status(404).render('error', { message: 'Reservation not found' });
        }

        await sendCancellationConfirmationEmail(deletedReservation.email);

        res.redirect('/getreservations/get-all-reservation');
    } catch (error) {
        res.render('error', { message: error.message });
    }
};

const sendCancellationConfirmationEmail = async (reservationEmail) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'oumaimaguedri66@gmail.com', 
                pass: 'uodg lyfg dnkc gacf' 
            }
        });

        let mailOptions = {
            from: 'oumaimaguedri66@gmail.com',
        to: 'oumaimaguedri66@gmail.com', //
            subject: 'Confirmation d\'annulation de réservation',
            text: 'Votre annulation de réservation a été confirmée. Si vous avez des questions, n\'hésitez pas à nous contacter.'
        };

        // Envoyer l'email
        let info = await transporter.sendMail(mailOptions);

        console.log('Email de confirmation d\'annulation envoyé : ' + info.response);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation d\'annulation:', error);
    }
};

module.exports = {
    confirmDeleteReservationController,
    deleteReservationController,
};
