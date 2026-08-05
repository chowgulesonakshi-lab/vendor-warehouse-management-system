const lowStockService = require("../services/lowStockServices");

const getLowStockProducts = async (req, res) => {

    try {

        const products =
            await lowStockService.getLowStockProducts();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getLowStockByProduct = async (req, res) => {

    try {

        const product =
            await lowStockService.getLowStockByProduct(
                req.params.productId
            );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product is not low in stock or does not exist."
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getLowStockProducts,
    getLowStockByProduct
};