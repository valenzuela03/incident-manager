const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true
    },
    phone: {
        type: Number,
        required: [true, 'Please provide your phone number'],
    },
    profilePicture: {
        type: String,
        default:
          "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png",
      },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'supporter', 'inCharge'],
        default: 'user'
    },
    speciality: {
        type: String,
        emun: ['none', 'hardware', 'software', 'network'],
        default: 'none'
    },
    ratings: {
        type: [Number], 
        default: []
    },
    averageRating: {
        type: Number,  // Campo para almacenar el promedio de las calificaciones
        default: 0
    }
}, {
    timestamps: true
});

userSchema.methods.updateAverageRating = function() {
    if (this.ratings.length > 0) {
        const total = this.ratings.reduce((sum, rating) => sum + rating, 0);
        this.averageRating = total / this.ratings.length;
    } else {
        this.averageRating = 0;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;