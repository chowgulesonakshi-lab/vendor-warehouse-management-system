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

    const [order] = await db.query(
        `INSERT INTO purchase_orders(
            supplier_id,
            warehouse_id,
            order_date,
            expected_delivery,
            created_by
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            supplier_id,
            warehouse_id,
            order_date,
            expected_delivery,
            created_by
        ]
    );
    const purchaseOrderId = order.insertId;

    for (const item of items) {
        await db.query(`INSERT INTO purchase_order_items
            (
                purchase_order_id,
                product_id,
                quantity,
                unit_price,
                total_price
            )
            VALUES (?, ?, ?, ?, ?)`,
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

const receivePurchaseOrder = async (
    purchaseOrderId,
    items,
    performedBy
) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [orders] = await connection.query(
            `
            SELECT *
            FROM purchase_orders
            WHERE id = ?
            `,
            [purchaseOrderId]
        );
        if (orders.length === 0) {
            throw new Error("Purchase order not found");
        }
        const purchaseOrder = orders[0];
        if (
            purchaseOrder.status === "Cancelled" ||
            purchaseOrder.status === "Received"
        ) {
            throw new Error(
                `Purchase order cannot be received. Current status: ${purchaseOrder.status}`
            );
        }
        let totalReceived = 0;
        for (const item of items) {
            const {
                product_id,
                quantity
            } = item;
            if (!quantity || quantity <= 0) {
                throw new Error(
                    "Received quantity must be greater than 0"
                );
            }
            const [poItems] = await connection.query(
                `
                SELECT *
                FROM purchase_order_items
                WHERE purchase_order_id = ?
                AND product_id = ?
                `,
                [
                    purchaseOrderId,
                    product_id
                ]
            );
            if (poItems.length === 0) {
                throw new Error(
                    `Product ${product_id} does not belong to this purchase order`
                );
            }
            const poItem = poItems[0];
            const remainingQuantity =
                poItem.quantity -
                poItem.received_quantity;
            if (quantity > remainingQuantity) {
                throw new Error(
                    `Cannot receive ${quantity} units of product ${product_id}. ` +
                    `Only ${remainingQuantity} units remaining.`
                );
            }
            await connection.query(
                `
                UPDATE purchase_order_items
                SET received_quantity =
                    received_quantity + ?
                WHERE id = ?
                `,
                [
                    quantity,
                    poItem.id
                ]
            );
            const [inventory] = await connection.query(
                `
                SELECT *
                FROM inventory
                WHERE product_id = ?
                AND warehouse_id = ?
                `,
                [
                    product_id,
                    purchaseOrder.warehouse_id
                ]
            );
            if (inventory.length === 0) {
                await connection.query(
                    `
                    INSERT INTO inventory
                    (
                        product_id,
                        warehouse_id,
                        quantity,
                        reserved_quantity,
                        available_quantity
                    )
                    VALUES (?, ?, ?, 0, ?)
                    `,
                    [
                        product_id,
                        purchaseOrder.warehouse_id,
                        quantity,
                        quantity
                    ]
                );
            } else {
                await connection.query(
                    `
                    UPDATE inventory
                    SET
                        quantity = quantity + ?,
                        available_quantity =
                            available_quantity + ?
                    WHERE product_id = ?
                    AND warehouse_id = ?
                    `,
                    [
                        quantity,
                        quantity,
                        product_id,
                        purchaseOrder.warehouse_id
                    ]
                );
            }
            await connection.query(
                `
                INSERT INTO stock_transactions
                (
                    product_id,
                    warehouse_id,
                    transaction_type,
                    quantity,
                    reference_id,
                    remarks,
                    performed_by
                )
                VALUES (?, ?, 'Stock In', ?, ?, ?, ?)
                `,
                [
                    product_id,
                    purchaseOrder.warehouse_id,
                    quantity,
                    purchaseOrderId,
                    "Goods received against purchase order",
                    performedBy
                ]
            );
            totalReceived += quantity;
        }
        const [remainingItems] = await connection.query(
            `
            SELECT *
            FROM purchase_order_items
            WHERE purchase_order_id = ?
            AND received_quantity < quantity
            `,
            [purchaseOrderId]
        );
        let newStatus;
        if (remainingItems.length === 0) {
            newStatus = "Received";
        } else {
            newStatus = "Partially Received";
        }
        await connection.query(
            `
            UPDATE purchase_orders
            SET status = ?
            WHERE id = ?
            `,
            [
                newStatus,
                purchaseOrderId
            ]
        );
        await connection.commit();
        return {
            purchase_order_id: purchaseOrderId,
            status: newStatus,
            total_received: totalReceived,
            message: "Goods received successfully"
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    createPurchaseOrder,
    receivePurchaseOrder
};