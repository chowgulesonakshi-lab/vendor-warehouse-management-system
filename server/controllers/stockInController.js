const stockInService = require("../services/stockInServices");

const addStock = (req, res) => {
    const stock = stockInService.addStock(req.body);
    res.status(201).json({
        success: true,
        data: stock
    });
};

const getAllStockEntries = (req, res) => {
    res.json({
        success: true,
        data: stockInService.getAllStockEntries()
    });
};

const getStockEntryById = (req, res) => {
    const stock = stockInService.getStockEntryById(req.params.id);
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
};

const getInventory = (req, res) => {
    res.json({
        success: true,
        data: stockInService.getInventory()
    });
};

module.exports = {
    addStock,
    getAllStockEntries,
    getStockEntryById,
    getInventory
};