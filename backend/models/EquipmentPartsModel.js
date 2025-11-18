const mongoose = require('mongoose');

const EquipmentPartsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['GPU', 'CPU', 'RAM', 'SSD', 'HDD', 'Motherboard', 'Power Supply', 'Cooling', 'Other'],
        required: true
    },
    model : {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
});

const PartModel = mongoose.model('Part', EquipmentPartsSchema);

module.exports = PartModel;