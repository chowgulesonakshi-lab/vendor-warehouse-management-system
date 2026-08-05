const express = require("express");
const router = express.Router();

const stockHistoryController = require("../controllers/stockHistoryController");

router.get("/", stockHistoryController.getStockHistory);
router.get("/history/product/:productId", stockHistoryController.getProductHistory);
router.get("/history/warehouse/:warehouseId", stockHistoryController.getWarehouseHistory);

module.exports = router;