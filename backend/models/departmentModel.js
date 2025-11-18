const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us the department name!']
    },
    inCharge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the inCharge of the department'],
    },
    areas: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Area',
    },
}, {
    timestamps: true
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;