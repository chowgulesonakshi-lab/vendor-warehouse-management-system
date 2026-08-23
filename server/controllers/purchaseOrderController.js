const purchaseOrderService = require("../services/purchaseOrderServices");

const createPurchaseOrder = async (req, res) => {
    try {
        const order =
            await purchaseOrderService.createPurchaseOrder(req.body);
        res.status(201).json({
            success: true,
            data: order
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const receiveGoods = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            items,
            performed_by
        } = req.body;
        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Items are required"
            });
        }
        const result =
            await purchaseOrderService.receivePurchaseOrder(
                id,
                items,
                performed_by
            );
        res.status(200).json({
            success: true,
            data: result
        });
    } catch(error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPurchaseOrder,
    receiveGoods
};