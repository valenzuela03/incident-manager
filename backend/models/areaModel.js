const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us the area name!']
    },
    equipments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.models.Area || mongoose.model('Area', areaSchema);

