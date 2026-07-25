const warehouseService = require("../services/warehouseServices");

const createWarehouse = (req, res) => {
    const warehouse = warehouseService.createWarehouse(req.body);
    res.status(201).json({
        success: true,
        data: warehouse
    });
};

const getAllWarehouses = (req, res) => {
    res.json({
        success: true,
        data: warehouseService.getAllWarehouses()
    });
};

const getWarehouseById = (req, res) => {
    const warehouse = warehouseService.getWarehouseById(req.params.id);
    if (!warehouse) {
        return res.status(404).json({
            success: false,
            message: "Warehouse not found"
        });
    }
    res.json({
        success: true,
        data: warehouse
    });
};

const updateWarehouse = (req, res) => {
    const warehouse = warehouseService.updateWarehouse(
    req.params.id, req.body
    );
    if (!warehouse) {
         return res.status(404).json({
             success: false,
             message: "Warehouse not found"
         });
    }
    res.json({
         success: true,
         data: warehouse
    });
};

const deleteWarehouse = (req, res) => {
    const deleted = warehouseService.deleteWarehouse(req.params.id);
    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: "Warehouse not found"
        });
    }
    res.json({
        success: true,
        message: "Warehouse deleted successfully."
    });
};

module.exports = {
    createWarehouse,
    getAllWarehouses,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse
};