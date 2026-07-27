let stockInHistory = [];
let inventory = [];
let nextStockInId = 1;

const addStock = (stockData) => {
    const stockEntry = {
        id: nextStockInId++,
        date: new Date().toISOString(),
        ...stockData
    };
    stockInHistory.push(stockEntry);
    const existingItem = inventory.find(item =>
        item.productId === stockData.productId &&
        item.warehouseId === stockData.warehouseId
    );
    if (existingItem) {
        existingItem.quantity += stockData.quantity;
    } else {
        inventory.push({
            productId: stockData.productId,
            warehouseId: stockData.warehouseId,
            quantity: stockData.quantity
        });
    }
    return stockEntry;
};

const getAllStockEntries = () => stockInHistory;
const getStockEntryById = (id) => {
    return stockInHistory.find(entry => entry.id === Number(id));
};

const getInventory = () => inventory;

module.exports = {
    addStock,
    getAllStockEntries,
    getStockEntryById,
    getInventory
};