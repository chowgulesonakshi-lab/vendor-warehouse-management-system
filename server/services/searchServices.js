const db = require("../../config/dbConfig");


const globalSearch = async (keyword) => {

    const search = `%${keyword}%`;

    // Products
    const [products] = await db.query(
        `
        SELECT
            p.id,
            p.product_name,
            p.sku,
            c.category_name,
            w.warehouse_name
        FROM products p
        JOIN categories c
            ON p.category_id = c.id
        JOIN warehouses w
            ON p.warehouse_id = w.id
        WHERE
            p.product_name LIKE ?
            OR p.sku LIKE ?
        `,
        [
            search,
            search
        ]
    );


    // Categories
    const [categories] = await db.query(
        `
        SELECT *
        FROM categories
        WHERE category_name LIKE ?
        `,
        [search]
    );


    // Warehouses
    const [warehouses] = await db.query(
        `
        SELECT *
        FROM warehouses
        WHERE
            warehouse_name LIKE ?
            OR city LIKE ?
        `,
        [
            search,
            search
        ]
    );


    // Suppliers
    const [suppliers] = await db.query(
        `
        SELECT *
        FROM suppliers
        WHERE
            supplier_name LIKE ?
            OR company_name LIKE ?
        `,
        [
            search,
            search
        ]
    );


    return {
        products,
        categories,
        warehouses,
        suppliers
    };

};


module.exports = {
    globalSearch
};