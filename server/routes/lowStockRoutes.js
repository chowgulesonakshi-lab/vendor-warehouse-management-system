const express = require("express");
const router = express.Router();

const lowStockController = require("../controllers/lowStockController");

router.get(
    "/",
    lowStockController.getLowStockProducts
);

router.get(
    "/:productId",
    lowStockController.getLowStockByProduct
);

module.exports = router;