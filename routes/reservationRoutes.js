const express = require('express');
const router = express.Router();



const reservationController = require('../controllers/reservationController');

router.post('/', reservationController.reserveMeetingRoom);



module.exports = router;