const stockInService = require("../services/stockInServices");

const addStock = async (req, res) => {
    try {
        const stock = await stockInService.addStock(req.body);
        res.status(201).json({
            success: true,
            data: stock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllStockEntries = async (req, res) => {
    try {
        const stockEntries = await stockInService.getAllStockEntries();
        res.json({
            success: true,
            data: stockEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getStockEntryById = async (req, res) => {
    try {
        const stock = await stockInService.getStockEntryById(req.params.id);
        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock entry not found"
            });
        }
        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getInventory = async (req, res) => {
    try {
        const inventory = await stockInService.getInventory();
        res.json({
            success: true,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addStock,
    getAllStockEntries,
    getStockEntryById,
    getInventory
};