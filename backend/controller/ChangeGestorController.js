const express = require("express");
const ChangesGestorModel = require("../models/ChangesGestor");
const PartModel = require("../models/EquipmentPartsModel");
const TaskModel = require("../models/Task");

exports.create = async (req, res) => {
  try {
    const { piece, message, price, incident } = req.body;
    const newChange = new ChangesGestorModel({
      piece,
      message,
      price,
      incident,
    });

    const task = await TaskModel.findById(incident);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.changes.push(newChange._id);
    await task.save();
    await newChange.save();

    await newChange.populate("piece");
    
    res.status(201).json({ message: "Change created successfully", newChange });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const changes = await ChangesGestorModel.find({
      status: { $nin: ["rejected", "completed"] }
    }).populate("piece incident");
    res.status(200).json(changes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptChange = async (req, res) => {
  try {
    const { id } = req.params;
    const change = await ChangesGestorModel.findById(id);
    if (!change) {
      return res.status(404).json({ message: "Change not found" });
    }
    if (change.status !== "pending") {
      return res.status(400).json({ message: "Change already administrade" });
    }

    const status = req.body.status;
    change.status = status;

    await change.save();
    res.status(200).json({ message: "Change accepted successfully", change });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}