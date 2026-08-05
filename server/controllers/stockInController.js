const stockService = require("../services/stockInServices");

const addStock = async (req, res) => {
    try {
        const stockData = {
            ...req.body,
            performed_by: req.user.id
        };
        const stock = await stockService.addStock(stockData);
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

const getAllStockTransactions = async (req, res) => {
    try {
        const transactions = await stockService.getAllStockTransactions();

        res.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getStockTransactionById = async (req, res) => {
    try {
        const transaction = await stockService.getStockTransactionById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Stock transaction not found"
            });
        }

        res.json({
            success: true,
            data: transaction
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
        const inventory = await stockService.getInventory();

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
    getAllStockTransactions,
    getStockTransactionById,
    getInventory
};