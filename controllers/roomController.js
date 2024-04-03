const Room = require('../models/room.js');

const createRoomController = async (req, res) => {
    try {
        const { name, floor, capacity, assets } = req.body;
        
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

const editRoomController = async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await Room.findById(roomId);

        if (!room) {
            console.log('Salle non trouvée');
            return res.status(404).render('error', { message: 'Salle non trouvée' });
        }

        res.render('admin/editroom', { room });
    } catch (error) {
        console.error('Erreur lors de la récupération de la salle pour édition :', error);
        res.status(500).render('error', { message: 'Erreur interne du serveur' });
    }
};

const updateRoomController = async (req, res) => {
    try {
        const roomId = req.params.id;
        const { name, floor, capacity } = req.body;
        
        // Créer un objet pour stocker les actifs mis à jour
        const updatedAssets = {};

        // Vérifier si la case à cocher macLab est cochée
        updatedAssets.macLab = req.body.assets && req.body.assets.macLab === 'on';
         updatedAssets.pcLab = req.body.assets && req.body.assets.pcLab === 'on';
        updatedAssets.projector = req.body.assets && req.body.assets.projector === 'on';
         updatedAssets.tv = req.body.assets && req.body.assets.tv === 'on';
         updatedAssets.whiteBoard = req.body.assets && req.body.assets.whiteBoard === 'on';

        // Mettre à jour la salle avec les nouvelles valeurs
        const updatedRoom = await Room.findByIdAndUpdate(roomId, { name, floor, capacity, assets: updatedAssets }, { new: true });

        // Vérifier si la salle a été mise à jour avec succès
        if (!updatedRoom) {
            return res.status(404).render('error', { message: 'Room not found' });
        }

        // Rediriger vers la liste des salles
        res.redirect('/api/rooms/get-all-admin-rooms');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la salle :', error);
        res.status(500).render('error', { message: 'Erreur interne du serveur' });
    }
};
const confirmDeleteRoomController = async (req, res) => {
    try {
        const roomId = req.params.id; 
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).render('error', { message: 'Room not found' });
        }

        res.render('admin/confirm_delete', { room });
    } catch (error) {
        res.render('error', { message: error.message });
    }
};

const deleteRoomController = async (req, res) => {
    try {
        const roomId = req.params.id; 
        const deletedRoom = await Room.findByIdAndDelete(roomId);

        if (!deletedRoom) {
            return res.status(404).render('error', { message: 'Room not found' });
        }

        res.redirect('/api/rooms/get-all-admin-rooms');
    } catch (error) {
        res.render('error', { message: error.message });
    }
};


module.exports = {
    createRoomController,
    allRoomsController,
    allRoomsAdminController,
    getAllRooms,
    editRoomController,
    updateRoomController,
    confirmDeleteRoomController,
    deleteRoomController,
};
