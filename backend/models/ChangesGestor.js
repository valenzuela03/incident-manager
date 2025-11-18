const mongoose = require('mongoose');

const ChangesGestorSchema = new mongoose.Schema({

    piece : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part',
        required: true
    }, 
    message : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    }, 
    status : {
        type: String,
        Enum: ['pending', 'rejected', 'completed'],
        default: 'pending'
    },
    incident : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {
    timestamps: true

});

module.exports = mongoose.model('ChangesGestor', ChangesGestorSchema);