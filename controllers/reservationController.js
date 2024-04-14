const Reservation = require('../models/reservation');

exports.reserveMeetingRoom = async (req, res) => {
  const { meetingRoomId, startTime, endTime } = req.body;
  const userId = req.userId;
  const startTimeUTC = new Date(startTime).toISOString(); // Format ISO 8601
  const endTimeUTC = new Date(endTime).toISOString(); // Format ISO 8601

  try {
    // Vérifier si la salle de réunion est disponible pour la plage horaire spécifiée
    const conflictingReservations = await Reservation.find({
      meetingRoom: meetingRoomId,
      $or: [
        { startTime: { $lt: endTimeUTC }, endTime: { $gt: startTimeUTC } }, // Vérification de chevauchement
        { startTime: { $gte: startTimeUTC, $lte: endTimeUTC } }, // Vérification d'inclusion
      ],
    });

    // Filtrer les réservations conflictuelles ayant un ID de salle de réunion différent
    const conflictingReservationsWithDifferentRoomId = conflictingReservations.filter(reservation => reservation.meetingRoom && reservation.meetingRoom.toString() !== meetingRoomId);


    if (conflictingReservationsWithDifferentRoomId.length > 0) {
      return res.status(400).json({ message: 'Conflit de réservation. La salle de réunion est déjà réservée pour cette plage horaire.' });
    }

    // Créer la nouvelle réservation
    const newReservation = new Reservation({
      user: userId,
      meetingRoom: meetingRoomId,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    });

    // Sauvegarder la nouvelle réservation dans la base de données
    await newReservation.save();

    res.status(201).json({ message: 'Réservation réussie !', reservation: newReservation });
  } catch (err) {
    console.error('Erreur lors de la réservation :', err);
    res.status(500).json({ message: 'Erreur lors de la réservation.' });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    // Récupérer toutes les réservations depuis la base de données
    const reservations = await Reservation.find();

    // Formater les données pour qu'elles soient compatibles avec FullCalendar
    const formattedReservations = reservations.map(reservation => {
      return {
        title: `Réservé `,
        start: reservation.startTime,
        end: reservation.endTime,
        id: reservation._id
      };
    });

    res.status(200).json(formattedReservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations.' });
  }
};
