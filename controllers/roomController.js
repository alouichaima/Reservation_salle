const Room = require('../models/room.js');

const createRoomController = async (req, res) => {
    try {
        const { name, floor, capacity, assets } = req.body;
        
        // Convertir les valeurs "on" en booléens pour les champs d'actifs
        const assetData = {};
        for (const key in assets) {
            if (Object.prototype.hasOwnProperty.call(assets, key)) {
                assetData[key] = assets[key] === 'on';
            }
        }

        const room = new Room({ name, floor, capacity, assets: assetData, author: req.userId });
        await room.save();
        res.render('admin/addroom', { message: 'Room created successfully' });
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
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.render('admin/addroom', { rooms });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    createRoomController,
    allRoomsController,
    allRoomsAdminController,
    getAllRooms,
};
