const dispatchOrderService = require("../services/dispatchOrderServices");

const createDispatchOrder = async(req, res) => {
    try {
        const order =
            await dispatchOrderService.createDispatchOrder(
                req.body
            );
        res.status(201).json({
            success: true,
            data: order
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const dispatchOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { performed_by } = req.body;
        const result =
            await dispatchOrderService.dispatchOrder(
                id,
                performed_by
            );
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createDispatchOrder,
    dispatchOrder
};