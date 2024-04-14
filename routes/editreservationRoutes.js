const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const { editReservationController, updateReservationController } = require('../controllers/editReservationController');


router.get('/:id/edit', authenticate, editReservationController);
router.post('/:id/edit', authenticate, updateReservationController);
router.put('/editreservations/:id/edit', authenticate, updateReservationController);

module.exports = router;

