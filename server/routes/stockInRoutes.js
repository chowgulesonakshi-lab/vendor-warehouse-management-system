const express = require("express");
const router = express.Router();
const stockInController = require("../controllers/stockInController");

router.post("/", stockInController.addStock);
router.get("/", stockInController.getAllStockEntries);
router.get("/inventory", stockInController.getInventory);
router.get("/:id", stockInController.getStockEntryById);
module.exports = router;