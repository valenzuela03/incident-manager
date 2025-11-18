const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    }, 
    speciality: {
        type: String,
        enum : ['Hardware', 'Software', 'Network'],
        required: [true, 'Please provide your speciality']
    },

});

const Support = mongoose.model('Support', supportSchema);
module.exports = Support;