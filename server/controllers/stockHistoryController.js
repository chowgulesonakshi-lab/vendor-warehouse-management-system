const stockService = require("../services/stockHistoryServices");

const getStockHistory = async(req, res) => {
    try{
        const history = await stockService.getStockHistory(req.query);
        res.status(200).json(history);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

const getProductHistory = async(req, res) => {
    try{
        const history = await stockService.getProductHistory(req.params.productId);
        res.status(200).json(history);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

const getWarehouseHistory  = async(req, res) => {
    try{
        const history = await stockService.getWarehouseHistory (req.params.warehouseId);
        res.status(200).json(history);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getStockHistory,
    getProductHistory,
    getWarehouseHistory
};