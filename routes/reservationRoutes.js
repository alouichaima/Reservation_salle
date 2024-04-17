const express = require('express');
const router = express.Router();




const reservationController = require('../controllers/reservationController');

router.post('/', reservationController.reserveMeetingRoom);
router.get('/', reservationController.getAllReservations);
router.get('/:roomId/reservations', reservationController.getAllReservations);





module.exports = router;