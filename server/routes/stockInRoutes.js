const express = require("express");
const router = express.Router();

const stockInController = require("../controllers/stockInController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, stockInController.addStock);
router.get("/", stockInController.getAllStockTransactions);
router.get("/inventory", stockInController.getInventory);
router.get("/:id", stockInController.getStockTransactionById);

module.exports = router;