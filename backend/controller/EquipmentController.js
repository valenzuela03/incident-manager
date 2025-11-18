const equipmentModel = require('../models/EquipmentModel');
const areaModel = require('../models/areaModel');
const PartModel = require('../models/EquipmentPartsModel');
exports.createEquipment = async (req, res) => {
    try {
        const { name, type, operatingSystem, areaId, parts, available } = req.body;

        if (!name || !type || !areaId) {
            return res.status(400).json({ message: 'Name, type, and areaId are required.' });
        }

        const area = await areaModel.findById(areaId);
        if (!area) {
            return res.status(400).json({ message: 'Area not found' });
        }


        const equipment = new equipmentModel({
            name,
            type,
            operatingSystem,
            area: areaId,
            available
        });

        await equipment.save();

        const partIds = [];
        if (parts && Array.isArray(parts)) {
            for (const part of parts) {
                const partDoc = new PartModel({
                    type: part.type,
                    model: part.model,
                    quantity: part.quantity,
                });
                await partDoc.save();
                partIds.push(partDoc._id); 
            }
        }
        
        equipment.parts = partIds;
        await equipment.save();

        area.equipments.push(equipment._id); 
        await area.save();

        const populatedEquipment = await equipmentModel.findById(equipment._id).populate('parts');

        res.status(201).json({
            message: 'Equipment created successfully with parts',
            data: populatedEquipment 
        });

    } catch (error) {
        console.error("Error in createEquipment:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getEquipmentForArea = async (req, res) => {
    try {
        const { areaId } = req.params;

        const area = await areaModel.findById(areaId).populate('equipments');
        if (!area) {
            return res.status(400).json({ message: 'Area not found' });
        }

        res.status(200).json({
            message: 'Equipment fetched successfully',
            data: area.equipments
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getEquipmentById = async (req, res) => {
    try {
        const { equipmentId } = req.params;

        const equipment = await equipmentModel.findById(equipmentId);

        if (!equipment) {
            return res.status(400).json({ message: 'Equipment not found' });
        }

        res.status(200).json({
            message: 'Equipment fetched successfully',
            data: equipment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
