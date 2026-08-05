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


module.exports = {
    createPurchaseOrder
};