const express = require("express");
const router = express.Router();

const purchaseOrderController =
require("../controllers/purchaseOrderController");

router.post("/", purchaseOrderController.createPurchaseOrder);
router.post("/:id/receive", purchaseOrderController.receiveGoods);

module.exports = router;