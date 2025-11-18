const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Computer', 'Server', 'Printer', 'Projector', 'Scanner', 'UPS', 'Router', 'Switch'],
        required: true
    },
    operatingSystem: {
        type: String
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    parts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part'
    }]
});

const EquipmentModel = mongoose.models.Equipment ||mongoose.model('Equipment', EquipmentSchema);

module.exports = EquipmentModel;
