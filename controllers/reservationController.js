const Reservation = require('../models/reservation');
const User = require('../models/user');
const Room = require('../models/room');

// Réserver une salle de réunion
// Réserver une salle de réunion
exports.reserveMeetingRoom = async (req, res) => {
  const { roomId, startTime, endTime } = req.body;
  const userId = req.userId;

  try {
    // Vérifier si la salle de réunion est disponible pour la plage horaire spécifiée
    const conflictingReservation = await Reservation.findOne({
      $and: [
        { room: roomId },
        {
          $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Vérification de chevauchement
            { startTime: { $gte: startTime, $lte: endTime } } // Nouvelle réservation incluse dans une réservation existante
          ]
        }
      ]
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: 'Conflit de réservation. La salle de réunion est déjà réservée pour cette plage horaire.' });
    }

    // Obtenir les détails de la salle
    const room = await Room.findById(roomId);

    if (!room) {
      // Si la salle n'est pas trouvée, renvoyer une réponse d'erreur
      return res.status(404).json({ message: 'Salle introuvable.' });
    }

    // Obtenir les détails de l'utilisateur
    const user = await User.findById(userId);

    // Aucun conflit trouvé, enregistrez la nouvelle réservation
    const newReservation = new Reservation({
      user: userId,
      room: roomId,
      startTime,
      endTime
    });

    // Enregistrer la réservation
    await newReservation.save();

    // Rendre la vue "reservation.ejs" avec les détails de la réservation et de la salle
    res.render('reservation', { 
      reservation: newReservation,
      room: room,
      user: user,
      pageTitle: 'Réservation réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la réservation.' });
  }
};
// Obtenir toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    let roomId = req.params.roomId;  // Obtenez l'ID de la salle à partir des paramètres de la requête
    if (!roomId) {
      // Si roomId est undefined (par exemple, pour la route /reservations), récupérez toutes les réservations sans filtrer par chambre
      const reservations = await Reservation.find().populate('room');
      // Formater les données pour qu'elles soient compatibles avec le composant de calendrier
      const formattedReservations = reservations.map(reservation => {
        return {
          title: `Réservé - ${reservation.room.name}`,
          start: reservation.startTime,
          end: reservation.endTime,
          room: reservation.room.name // Nom de la salle
        };
      });
      // Renvoyer les données formatées au format JSON
      return res.status(200).json(formattedReservations);
    }

    // Récupérer toutes les réservations pour la salle spécifique depuis la base de données
    const reservations = await Reservation.find({ room: roomId }).populate('room');

    // Formater les données pour qu'elles soient compatibles avec le composant de calendrier
    const formattedReservations = reservations.map(reservation => {
      return {
        title: 'Réservé',
        start: reservation.startTime,
        end: reservation.endTime,
        room: reservation.room.name // Nom de la salle
      };
    });

    // Renvoyer les données formatées au format JSON
    res.status(200).json(formattedReservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations.' });
  }
};
