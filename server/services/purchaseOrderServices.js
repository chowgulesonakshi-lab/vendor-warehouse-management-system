const db = require("../../config/dbConfig");


const createPurchaseOrder = async (orderData) => {

    const {
        supplier_id,
        warehouse_id,
        order_date,
        expected_delivery,
        created_by,
        items
    } = orderData;


    // Create Purchase Order

    const [order] = await db.query(
        `
        INSERT INTO purchase_orders
        (
            supplier_id,
            warehouse_id,
            order_date,
            expected_delivery,
            created_by
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            supplier_id,
            warehouse_id,
            order_date,
            expected_delivery,
            created_by
        ]
    );


    const purchaseOrderId = order.insertId;


    // Add Purchase Order Items

    for (const item of items) {

        await db.query(
            `
            INSERT INTO purchase_order_items
            (
                purchase_order_id,
                product_id,
                quantity,
                unit_price,
                total_price
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                purchaseOrderId,
                item.product_id,
                item.quantity,
                item.unit_price,
                item.quantity * item.unit_price
            ]
        );

    }
    return {
        purchase_order_id: purchaseOrderId,
        message: "Purchase order created successfully"
    };

};



module.exports = {
    createPurchaseOrder
};