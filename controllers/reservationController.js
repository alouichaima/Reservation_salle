const Reservation = require('../models/reservation');
const User = require('../models/user');
const Room = require('../models/room');

exports.reserveMeetingRoom = async (req, res) => {
  const { roomId, startTime, endTime } = req.body;
  const userId = req.userId;

  try {
    const conflictingReservation = await Reservation.findOne({
      $and: [
        { room: roomId },
        {
          $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, 
            { startTime: { $gte: startTime, $lte: endTime } } 
          ]
        }
      ]
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: 'Conflit de réservation. La salle de réunion est déjà réservée pour cette plage horaire.' });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Salle introuvable.' });
    }

    const user = await User.findById(userId);

    const newReservation = new Reservation({
      user: userId,
      room: roomId,
      startTime,
      endTime
    });

    await newReservation.save();

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
exports.getAllReservations = async (req, res) => {
  try {
    let roomId = req.params.roomId;  
    if (!roomId) {
      const reservations = await Reservation.find().populate('room');
      const formattedReservations = reservations.map(reservation => {
        return {
          title: `Réservé - ${reservation.room.name}`,
          start: reservation.startTime,
          end: reservation.endTime,
          room: reservation.room.name 
        };
      });
      return res.status(200).json(formattedReservations);
    }

    const reservations = await Reservation.find({ room: roomId }).populate('room');

    const formattedReservations = reservations.map(reservation => {
      return {
        title: 'Réservé',
        start: reservation.startTime,
        end: reservation.endTime,
        room: reservation.room.name 
      };
    });

    res.status(200).json(formattedReservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations.' });
  }
};
