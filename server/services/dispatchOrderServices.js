const db = require("../../config/dbConfig");

const createDispatchOrder = async (orderData) => {
    const {
        customer_name,
        customer_phone,
        customer_address,
        dispatch_date,
        created_by,
        items
    } = orderData;
    const [order] = await db.query(
        `INSERT INTO dispatch_orders
        (
            customer_name,
            customer_phone,
            customer_address,
            dispatch_date,
            created_by
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            customer_name,
            customer_phone,
            customer_address,
            dispatch_date,
            created_by
        ]
    );

    const dispatchOrderId = order.insertId;
    let totalAmount = 0;

    for (const item of items) {
        const totalPrice =
            item.quantity * item.selling_price;
        await db.query(
            `INSERT INTO dispatch_items
            (
                dispatch_order_id,
                product_id,
                quantity,
                selling_price,
                total_price
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                dispatchOrderId,
                item.product_id,
                item.quantity,
                item.selling_price,
                totalPrice
            ]
        );
        totalAmount += totalPrice;
    }
    await db.query(
        `
        UPDATE dispatch_orders
        SET total_amount = ?
        WHERE id = ?
        `,
        [
            totalAmount,
            dispatchOrderId
        ]
    );
    return {
        dispatch_order_id: dispatchOrderId,
        total_amount: totalAmount,
        message: "Dispatch order created successfully"
    };
};

const dispatchOrder = async (
    dispatchOrderId,
    performedBy) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [orders] = await connection.query(
            `
            SELECT *
            FROM dispatch_orders
            WHERE id = ?
            `,
            [dispatchOrderId]
        );
        if (orders.length === 0) {
            throw new Error("Dispatch order not found");
        }
        const dispatchOrder = orders[0];

        if (
            dispatchOrder.status === "Dispatched" ||
            dispatchOrder.status === "Delivered"
        ) {
            throw new Error(
                `Dispatch order cannot be dispatched. Current status: ${dispatchOrder.status}`
            );
        }

        const [items] = await connection.query(
            `
            SELECT *
            FROM dispatch_items
            WHERE dispatch_order_id = ?
            `,
            [dispatchOrderId]
        );

        if (items.length === 0) {
            throw new Error(
                "Dispatch order has no items"
            );
        }
        let totalDispatched = 0;

        for (const item of items) {
            const {
                product_id,
                quantity
            } = item;

            if (!quantity || quantity <= 0) {
                throw new Error(
                    `Invalid quantity for product ${product_id}`
                );
            }

            const [products] = await connection.query(
                `
                SELECT warehouse_id
                FROM products
                WHERE id = ?
                `,
                [product_id]
            );

            if (products.length === 0) {
                throw new Error(
                    `Product ${product_id} not found`
                );
            }
            const warehouseId = products[0].warehouse_id;

            const [inventoryRows] =
                await connection.query(
                    `
                    SELECT *
                    FROM inventory
                    WHERE product_id = ?
                    AND warehouse_id = ?
                    FOR UPDATE
                    `,
                    [
                        product_id,
                        warehouseId
                    ]
                );

            if (inventoryRows.length === 0) {
                throw new Error(
                    `No inventory found for product ${product_id}`
                );
            }
            const inventory = inventoryRows[0];
            if (
                inventory.available_quantity <
                quantity
            ) {
                throw new Error(
                    `Insufficient stock for product ${product_id}. ` +
                    `Available: ${inventory.available_quantity}, ` +
                    `Required: ${quantity}`
                );
            }

            await connection.query(
                `
                UPDATE inventory
                SET
                    quantity = quantity - ?,
                    available_quantity =
                        available_quantity - ?
                WHERE product_id = ?
                AND warehouse_id = ?
                `,
                [
                    quantity,
                    quantity,
                    product_id,
                    warehouseId
                ]
            );

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
                VALUES (?,?,'Stock Out',?,?,?,?)`,
                [
                    product_id,
                    warehouseId,
                    quantity,
                    dispatchOrderId,
                    "Goods dispatched against dispatch order",
                    performedBy
                ]
            );
            totalDispatched += quantity;
        }

        await connection.query(
            `
            UPDATE dispatch_orders
            SET
                status = 'Dispatched',
                dispatch_date = COALESCE(
                    dispatch_date,
                    CURDATE()
                )
            WHERE id = ?
            `,
            [dispatchOrderId]
        );
        await connection.commit();

        return {
            dispatch_order_id: dispatchOrderId,
            status: "Dispatched",
            total_dispatched: totalDispatched,
            message: "Order dispatched successfully"
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    createDispatchOrder,
    dispatchOrder
};