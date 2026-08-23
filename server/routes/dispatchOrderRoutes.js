const express = require("express");
const router = express.Router();

const dispatchOrderController = require("../controllers/dispatchOrderController");
router.post("/", dispatchOrderController.createDispatchOrder);
router.post("/:id/dispatch", dispatchOrderController.dispatchOrder);

module.exports = router;