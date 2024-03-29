const Room = require('../models/room.js');

const createRoomController = async (req, res) => {
    try {
        const { name, floor, capacity, assets } = req.body;
        
        const room = new Room({ name, floor, capacity, assets, author: req.userId });
        await room.save();
        res.render('addroom', { message: 'Room created successfully' }); 
    } catch (error) {
        res.render('error', { message: error.message }); 
    }
}


const allRoomsController = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.render('room', { rooms, user: req.user }); 
    } catch (error) {
        res.render('error', { message: 'Server error' });
    }
}

const allRoomsAdminController = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.render('admin/list_room', { rooms }); 
    } catch (error) {
        res.render('error', { message: 'Server error' });
    }
}

module.exports = {
    createRoomController,
    allRoomsController,
    allRoomsAdminController,
};
