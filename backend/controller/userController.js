const express = require("express");
const userModel = require("../models/userModel");
const Support = require("../models/Support");

exports.getUserInfoById = async (req, res) => {
    try {
        const { id } = req.body;

        const user
            = await userModel.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            user
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.getAllusers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password');
        res.status(200).json({
            status: 'success',
            users
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.getAllInchargeUsers = async (req, res) => {
    try {
        const users = await Support.find().populate('user', '-password');

        res.status(200).json({
            status: 'success',
            users
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.updateRolUser = async (req, res) => {
    try {
        const id = req.params.id;
        const role = req.body.role;
        const user = await userModel.findByIdAndUpdate(id, { role } );
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        user.speciality = req.body.specialty;
        user.save();

        res.status(200).json({
            status: 'success',
            user
        });

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.getAllTechnicians = async (req, res) => {
    try {
        const users = await userModel.find({ role: 'supporter' }).select('-password');
        res.status(200).json({
            users
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}