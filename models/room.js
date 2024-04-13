const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
    name: { type: String, index: true, required: true },
    floor: { type: String, required: true },
    
    capacity: Number,
    assets: {
        macLab: { type: Boolean, default: false },
        pcLab: { type: Boolean, default: false },
        projector: { type: Boolean, default: false },
        tv: { type: Boolean, default: false },
        whiteBoard: { type: Boolean, default: false }
    },
    //  image: String 

})
const Room = (module.exports = mongoose.model('Room', roomSchema));