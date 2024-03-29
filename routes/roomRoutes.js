const express = require('express');
const authenticate = require('../middleware/authenticate');
const { createRoomController, allRoomsController, allRoomsAdminController } = require('../controllers/roomController');
const router = express.Router();

router.post('/createrooms', createRoomController);

router.get('/get-all-rooms', allRoomsController);

router.get('/get-all-admin-rooms', allRoomsAdminController);

module.exports = router;
