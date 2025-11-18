const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
   equipment: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Equipment'
   },
   assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please tell us who is assigned to solve the problem!']
   },
   rootCause: {
         type: String,
    },
    knownError: {
        type: String,
    },
    solution: {
        type: String,
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    solutionDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'solved'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;