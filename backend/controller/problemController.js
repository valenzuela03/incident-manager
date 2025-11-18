const Problem = require('../models/Problem');
const EquipmentModel = require('../models/equipmentModel');
const User = require('../models/userModel');
const taskModel = require('../models/Task');

exports.createProblem = async (req, res) => {
    try {
        const { equipment, assignedTo} = req.body;
        const equipmentModel = await EquipmentModel.findById(equipment);
        const user = await User.findById(assignedTo); 
        if (!equipmentModel) {
            return res.status(404).json({
                status: 'fail',
                message: 'Equipment not found'
            });
        }
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        
        const problem = new Problem({
            equipment,
            assignedTo,
        });
        await problem.save();

        const populatedProblem = await Problem.findById(problem._id).populate('equipment').populate('assignedTo');

        
        res.status(201).json({
            status: 'success',
            populatedProblem
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find().populate('equipment').populate('assignedTo');
        res.status(200).json({
            status: 'success',
            results: problems.length,
            data: {
                problems
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getMyAssignedProblems = async (req, res) => {
    try {
        const problems = await Problem.find({
            assignedTo: req.body.id, 
            status: { $ne: 'solved' } 
          })
            .populate('equipment')
            .populate('assignedTo');
        console.log(problems);
        res.status(200).json({
            status: 'success',
            results: problems.length,
            data: {
                problems
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.updateProblem = async (req, res) => {
    try {
        let problem = await Problem.findByIdAndUpdate
        (req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        problem.status = "solved";
        problem.solutionDate = Date.now();
        problem.save();
        const newTask = new taskModel({
            subject: problem.rootCause,
            message: problem.knownError,
            createdBy: problem.assignedTo,
            assignedEquipment: problem.equipment,
            creationDate: Date.now()
        });

        await newTask.save();
        
        res.status(200).json({
            status: 'success',
            data: {
                problem,
                newTask
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}