const taskModel = require("../models/Task");
const userModel = require("../models/userModel");
const EquipmentModel = require("../models/equipmentModel");
const departmentModel = require("../models/departmentModel");
const Support = require("../models/Support");
const router = require("../routes/taskRoute");

exports.createTask = async (req, res) => {
  try {
    const { subject, message, createdBy, assignedEquipment, creationDate } =
      req.body;

    if (
      !subject ||
      !message ||
      !createdBy ||
      !assignedEquipment ||
      !creationDate
    ) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const user = await userModel.findById(createdBy);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const equipment = await EquipmentModel.findById(assignedEquipment);
    if (!equipment) {
      return res.status(404).send({ error: "Equipment not found" });
    }

    const existingTask = await taskModel.findOne({
      assignedEquipment,
      status: { $ne: "completed" },
    });
  

    const task = new taskModel({
      subject,
      message,
      createdBy,
      assignedEquipment,
      creationDate,
    });
    await task.save();

    res.status(201).send({
      message: "Task created successfully",
      task,
      assignedUser: user.name,
      assignedEquipment: equipment.name,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while creating the task" });
  }
};
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find()
      .populate("createdBy", "name")
      .populate("assignedEquipment", "name")
      .populate("assignedTo", "name");
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching tasks" });
  }
};

exports.authorizeTask = async (req, res) => {
  try {
    console.log(req.body);
    const { taskId, assignedTo, priority, type } = req.body;
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    const user = await userModel.findById(assignedTo);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    task.status = "inProgress";
    task.priority = priority;
    task.assignedTo = assignedTo;
    task.type = type;
    await task.save();

    res
      .status(200)
      .send({
        message: "Task assigned successfully",
        task,
        assignedUser: user.name,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while assigning task" });
  }
};

exports.getUnassignedTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find({ assignedTo: null })
      .populate("createdBy", "name")
      .populate("assignedEquipment", "name");
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching tasks" });
  }
};

exports.getMyGeneratedTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find({ createdBy: req.body.id })
      .populate({
        path: "createdBy",
        select: "name email role rating phone",
      })
      .populate({
        path: "assignedEquipment",
        select: "name type operatingSystem available",
        populate: {
          path: "parts",
          select: "type model quantity",
        },
      })
      .populate({
        path: "assignedTo",
        select: "name email role rating phone",
      })
      .populate({
        path: "changes",
        select: "message price status",
        populate: {
          path: "piece",
          select: "name type model",
        },
      });
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching tasks" });
  }
};

exports.getMyAssignedTasks = async (req, res) => {
  try {
      const tasks = await taskModel.find({ assignedTo: req.body.id, status: { $nin: ["completed", "liberated"] } })
          .populate({
              path: 'createdBy',
              select: 'name email role rating phone',
          })
          .populate({
              path: 'assignedEquipment',
              select: 'name type operatingSystem available',
              populate: {
                  path: 'parts',
                  select: 'type model quantity',
              }
          })
          .populate({
              path: 'assignedTo',
              select: 'name email role rating phone',
          })
          .populate({
              path: 'changes',
              select: 'message price status',
              populate: {
                  path: 'piece',
                  select: 'name type model'
              }
          });
      
      tasks.sort((a, b) => {
          const priorityOrder = { low: 3, medium: 2, high: 1 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      res.status(200).send(tasks);
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred while fetching tasks' });
  }
};
exports.getAllBuildingAndEquipmentInfo = async (req, res) => {
  try {
    const departments = await departmentModel.find().populate({
      path: "areas",
      select: "equipments",
      populate: {
        path: "equipments",
        select: "name type available",
      },
    });

    const result = departments.map((department) => ({
      _id: department._id,
      name: department.name,
      inCharge: department.inCharge,
      equipments: department.areas.flatMap((area) => area.equipments),
    }));

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        error: "An error occurred while fetching departments and equipments",
      });
  }
};

exports.finishTask = async (req, res) => {
  try {
    const { id } = req.params;
    const completedAt = new Date();
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    task.status = "completed";
    task.completedAt = completedAt;
    await task.save();

    res.status(200).send({ message: "Task finished successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while finishing task" });
  }
};

exports.getMyCompletedTasks = async (req, res) => {
  try {
    const tasks = await taskModel
    .find({ 
      assignedTo: req.body.id, 
      status: { $in: ["completed", "liberated"] } })    
      .populate({
        path: "createdBy",
        select: "name email role rating phone",
      })
      .populate({
        path: "assignedEquipment",
        select: "name type operatingSystem available",
        populate: {
          path: "parts",
          select: "type model quantity",
        },
      })
      .populate({
        path: "assignedTo",
        select: "name email role rating phone",
      })
      .populate({
        path: "changes",
        select: "message price status",
        populate: {
          path: "piece",
          select: "name type model",
        },
      });

    tasks.sort((a, b) => {
      const priorityOrder = { low: 3, medium: 2, high: 1 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching tasks" });
  }
};


exports.getAllCompletedTasks = async (req, res) => {
  try {
    const tasks = await taskModel
    .find({ status: { $in: ["completed", "liberated"] } })
    .populate({ path: "createdBy", select: "name email role rating phone" })
    .populate({ path: "assignedEquipment", select: "name type operatingSystem available", populate: { path: "parts", select: "type model quantity" } })
    .populate({ path: "assignedTo", select: "name email role rating phone" })
    .populate({ path: "changes", select: "message price status", populate: { path: "piece", select: "name type model" } });
  
    tasks.sort((a, b) => {
      const priorityOrder = { low: 3, medium: 2, high: 1 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    res.status(200).send(tasks);


  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching tasks" });
  }
};

exports.setSrviceType = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { serviceType } = req.body;
    const task = await taskModel
      .findById(taskId)
      .populate("assignedEquipment", "name type");
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    task.serviceType = serviceType;
    await task.save();
    res.status(200).send({ message: "Service type set successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while setting service type" });
  }
}

exports.liberateIncident = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { rating } = req.body;

    // Validar si el rating es un número entre 1 y 5
    if (rating && (typeof rating !== "number" || rating < 1 || rating > 5)) {
      return res.status(400).send({ error: "Rating must be a number between 1 and 5" });
    }

    // Buscar la tarea por ID
    const task = await taskModel
      .findById(taskId)
      .populate("assignedEquipment", "name type")
      .populate("assignedTo"); // Asegurarse de que la tarea tenga la referencia del usuario

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    // Verificar si la tarea ya está liberada
    if (task.status === "liberated") {
      return res.status(400).send({ error: "Incident already liberated" });
    }

    // Actualizar el estado de la tarea
    task.status = "liberated";

    // Si se proporciona un rating, asignarlo y actualizar el promedio de calificación
    if (rating) {
      // Asignar la calificación al responsable de la tarea
      task.assignedTo.ratings.push(rating); // Agregar la nueva calificación al arreglo de calificaciones

      // Recalcular el promedio de calificación del usuario
      const totalRatings = task.assignedTo.ratings.reduce((sum, rating) => sum + rating, 0);
      task.assignedTo.averageRating = totalRatings / task.assignedTo.ratings.length; // Actualizar el promedio

      // Guardar los cambios en el usuario (si es necesario)
      await task.assignedTo.save();
    }

    // Guardar los cambios en la tarea
    await task.save();

    // Enviar respuesta
    res.status(200).send({
      message: "Incident liberated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while liberating incident" });
  }
};

