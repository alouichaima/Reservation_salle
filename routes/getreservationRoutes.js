const express = require('express');
const router = express.Router();
const { allReservationController } = require('../controllers/getReservationController');
const authenticate = require('../middleware/authenticate');

router.get('/get-all-reservation', authenticate, allReservationController);

module.exports = router;
