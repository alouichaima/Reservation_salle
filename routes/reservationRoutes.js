const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');


const reservationController = require('../controllers/reservationController');

router.post('/', reservationController.reserveMeetingRoom);

module.exports = router;
