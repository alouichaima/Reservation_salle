const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const { createRoomController, allRoomsController, allRoomsAdminController, editRoomController,confirmDeleteRoomController,deleteRoomController
    ,updateRoomController} = require('../controllers/roomController');
const roomController = require('../controllers/roomController');
router.post('/createrooms' , authenticate, createRoomController);
router.get('/createrooms',authenticate, roomController.getAllRooms);

router.get('/get-all-rooms', authenticate, allRoomsController);
router.get('/get-all-admin-rooms', authenticate, allRoomsAdminController);

router.get('/rooms', allRoomsAdminController);

router.get('/:id/edit', authenticate, editRoomController);
router.post('/:id/edit', authenticate, updateRoomController);
router.put('/api/rooms/:id/edit', authenticate, updateRoomController);


router.get('/:id/delete', authenticate, confirmDeleteRoomController);
router.post('/:id/delete', authenticate, deleteRoomController);
router.delete('/api/rooms/:id/delete', authenticate, deleteRoomController);


module.exports = router;
