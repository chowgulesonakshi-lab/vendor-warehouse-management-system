let warehouses = [];
const getAllWarehouses = () => warehouses;

const getWarehouseById = (id) => {
    return warehouses.find(w=> w.id === Number(id));
};

const createWarehouse = (warehouse) => {
    const newWarehouse = {
        id: warehouses.length+1,
        ...warehouse
    };
    warehouses.push(newWarehouse);
    return newWarehouse;
};

const updateWarehouse = (id, updatedData) => {
    const warehouse = warehouses.find(w => w.id === Number(id));
    if(!warehouse) {
        return null;
    }
    Object.assign(warehouse, updatedData);
    return warehouse;
};

const deleteWarehouse = (id) => {
    const index = warehouses.findIndex(w => w.id === Number(id));
    if(index === -1) {
        return false;
    }
    warehouses.splice(index, 1);
    return true;
};

module.exports = {
    getAllWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
};