const Reservation = require('../models/reservation');

exports.reserveMeetingRoom = async (req, res) => {
  const { meetingRoomId, startTime, endTime } = req.body;
  const userId = req.userId;
  const startTimeUTC = new Date(startTime).toISOString(); // Format ISO 8601
  const endTimeUTC = new Date(endTime).toISOString(); // Format ISO 8601

  try {
    // Vérifier si la salle de réunion est disponible pour la plage horaire spécifiée
    const conflictingReservation = await Reservation.findOne({
  $or: [
    { meetingRoom: meetingRoomId, startTime: { $lt: endTimeUTC }, endTime: { $gt: startTimeUTC } }, // Vérification de chevauchement pour la salle spécifique
    { meetingRoom: { $ne: meetingRoomId }, startTime: { $lt: endTimeUTC, $gte: startTimeUTC }, endTime: { $gt: startTimeUTC, $lte: endTimeUTC } }, // Vérification d'inclusion pour d'autres salles
  ],
});

    
    if (conflictingReservation) {
      return res.status(400).json({ message: 'Conflit de réservation. La salle de réunion est déjà réservée pour cette plage horaire.' });
    }
    
    // Aucun conflit trouvé, enregistrez la nouvelle réservation
    const newReservation = new Reservation({
      user: userId,
      meetingRoom: meetingRoomId, // Utilisation de l'ID de la salle
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    });
    
    await newReservation.save();
    res.render('reservation', { reservation: newReservation });
  } catch (error) {
    console.error('Erreur lors de la réservation :', error);
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
