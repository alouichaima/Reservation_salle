const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const { confirmDeleteReservationController, deleteReservationController } = require('../controllers/deleteReservationController');

router.get('/:id/delete', authenticate, confirmDeleteReservationController);
router.post('/:id/delete', authenticate, deleteReservationController);
router.delete('/:id', authenticate, deleteReservationController); // Modifié l'URL de cette route

module.exports = router;
