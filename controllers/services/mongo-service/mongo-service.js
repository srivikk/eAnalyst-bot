//Create
exports.createOperation = async (colectionName, data) => {
    const model = require("../../../models/" + colectionName)
    const modelData = new model(data)
    return await modelData.save();
}

//read
exports.readOperation = async(colectionName) => {
    const model = require("../../../models/" + colectionName)
    const data = await model.find({})
    return data 
}

//update
exports.updateOperation = async (colectionName,data) => {
    const model = require("../../../models/" + colectionName)
    await model.findOneAndUpdate(data.updatedBy, data.updateObject,{new:true})
    return
}

exports.deleteOperation = async (colectionName,data) => {
    const model = require("../../../models/" + colectionName)
    await model.findOneAndRemove(data._id)
    return 
}