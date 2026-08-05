const db = require("../../config/dbConfig");

const getAllWarehouses = async () => {
    const [rows] = await db.query("SELECT * FROM warehouses");
    return rows;
};

const getWarehouseById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM warehouses WHERE id = ?",
        [id]
    );

    return rows[0] || null;
};

const createWarehouse = async (warehouse) => {
    const [result] = await db.query(
        `INSERT INTO warehouses
        (
            warehouse_name,
            address,
            city,
            state,
            pincode,
            capacity,
            manager_id,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            warehouse.warehouse_name,
            warehouse.address,
            warehouse.city,
            warehouse.state,
            warehouse.pincode,
            warehouse.capacity,
            warehouse.manager_id,
            warehouse.status || "Active"
        ]
    );

    return {
        id: result.insertId,
        ...warehouse
    };
};

const updateWarehouse = async (id, warehouse) => {
    const [result] = await db.query(
        `UPDATE warehouses
        SET
            warehouse_name = ?,
            address = ?,
            city = ?,
            state = ?,
            pincode = ?,
            capacity = ?,
            manager_id = ?,
            status = ?
        WHERE id = ?`,
        [
            warehouse.warehouse_name,
            warehouse.address,
            warehouse.city,
            warehouse.state,
            warehouse.pincode,
            warehouse.capacity,
            warehouse.manager_id,
            warehouse.status,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getWarehouseById(id);
};

const deleteWarehouse = async (id) => {
    const [result] = await db.query(
        "DELETE FROM warehouses WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
};

module.exports = {
    getAllWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
};