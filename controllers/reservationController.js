const Reservation = require('../models/reservation');

exports.reserveMeetingRoom = async (req, res) => {
  const { meetingRoomId, startTime, endTime } = req.body;
  const userId = req.userId;
  const startTimeUTC = new Date(startTime).toISOString(); // Format ISO 8601
  const endTimeUTC = new Date(endTime).toISOString(); // Format ISO 8601

  try {
    // Vérifier si la salle de réunion est disponible pour la plage horaire spécifiée
    const conflictingReservation = await Reservation.findOne({
      meetingRoom: meetingRoomId,
      $or: [
        { startTime: { $lt: endTimeUTC }, endTime: { $gt: startTimeUTC } },
        { startTime: { $gte: startTimeUTC, $lte: endTimeUTC } },
      ],
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: 'Conflit de réservation. La salle de réunion est déjà réservée pour cette plage horaire.' });
    }

    // Créer la nouvelle réservation
    const newReservation = new Reservation({
      user: userId,
      meetingRoom: meetingRoomId,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    });

    await newReservation.save();

    res.status(201).json({ message: 'Réservation réussie !', reservation: newReservation });
  } catch (err) {
    console.error('Erreur lors de la réservation :', err);
    res.status(500).json({ message: 'Erreur lors de la réservation.' });
  }

};








