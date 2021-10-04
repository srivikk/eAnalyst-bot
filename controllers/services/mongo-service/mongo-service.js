const Supplier = require('../../../models/supplier')
//read
exports.readOperation = async(collectionName,name) => {
    const model = require("../../../models/" + collectionName)
    console.log(name)
    const data = await model.find({"name":name}).populate('supplier_id')
    return data 
}