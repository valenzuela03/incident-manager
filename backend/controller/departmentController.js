const express = require("express");
const departmentModel = require("../models/departmentModel");
const userModel = require("../models/userModel");
const areaModel = require("../models/areaModel");
const { model } = require("mongoose");
exports.createDepartment = async (req, res) => {
    try {
        const { name, inCharge } = req.body;

        const existingDepartment = await departmentModel.findOne({ name: name });

        if (existingDepartment) {
            return res.status(400).json({
                status: 'fail',
                message: 'Department already exists'
            });
        }

        const existingUser = await userModel.findById(inCharge);
        if (!existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        const dept = await departmentModel.create({
            name,
            inCharge
        });

        res.status(201).json({
            status: 'success',
            dept
        });

    }catch(error){
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.getMyBuildings = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        
        const departments = await departmentModel
        .find({ inCharge: user._id })
        .populate({
          path: 'areas',
          populate: {
            path: 'equipments',
            model: 'Equipment',
            populate: {
              path: 'parts',
              model: 'Part'
            }
          }
        });
      

        if (!departments) {
            return res.status(404).json({
                status: 'fail',
                message: 'Department not found'
            });
        }

        res.status(200).json({
            status: 'success',
            departments
        });

        
    }catch(error){
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.addNewArea = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    try {
      const newArea = await areaModel.create({
        name,
      });
  
      
      const department = await departmentModel.findByIdAndUpdate(
        id,
        { $push: { areas: newArea._id } }, 
        { new: true } 
      );
  
      if (!department) {
        return res.status(404).json({ success: false, message: 'Department not found' });
      }
  
      res.status(201).json({
        success: true,
        data: {
          areaId: newArea._id,  
          area: newArea,
          department,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error adding area', error });
    }
}