const db = require("../../config/dbConfig");

const getAllSuppliers = async () => {
    const [rows] = await db.query("SELECT * FROM suppliers");
    return rows;
};

const getSupplierById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM suppliers WHERE id = ?",
        [id]
    );

    return rows[0] || null;
};

const createSupplier = async (supplier) => {
    const [result] = await db.query(
        `INSERT INTO suppliers
        (
            supplier_name,
            company_name,
            email,
            phone,
            address,
            city,
            state,
            gst_number,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            supplier.supplier_name,
            supplier.company_name,
            supplier.email,
            supplier.phone,
            supplier.address,
            supplier.city,
            supplier.state,
            supplier.gst_number,
            supplier.status || "Active"
        ]
    );

    return {
        id: result.insertId,
        ...supplier
    };
};

const updateSupplier = async (id, supplier) => {
    const [result] = await db.query(
        `UPDATE suppliers
        SET
            supplier_name = ?,
            company_name = ?,
            email = ?,
            phone = ?,
            address = ?,
            city = ?,
            state = ?,
            gst_number = ?,
            status = ?
        WHERE id = ?`,
        [
            supplier.supplier_name,
            supplier.company_name,
            supplier.email,
            supplier.phone,
            supplier.address,
            supplier.city,
            supplier.state,
            supplier.gst_number,
            supplier.status,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getSupplierById(id);
};

const deleteSupplier = async (id) => {
    const [result] = await db.query(
        "DELETE FROM suppliers WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};