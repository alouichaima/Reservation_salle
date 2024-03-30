const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { createRoomController, allRoomsController, allRoomsAdminController } = require('../controllers/roomController');
const roomController = require('../controllers/roomController');
router.post('/createrooms', authenticate, createRoomController);
router.get('/createrooms',authenticate, roomController.getAllRooms);

router.get('/get-all-rooms', authenticate, allRoomsController);
router.get('/get-all-admin-rooms', authenticate, allRoomsAdminController);

module.exports = router;
