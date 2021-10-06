const { createOperation,updateOperation, deleteOperation, readOperation } = require('./services/mongo-service/mongo-service')

exports.crudController = async (req, res) => {
    const collection = req.params.collection;
    const data = req.body;
    const operation = req.query.operation

    if (operation === "create") {
        await createOperation(collection, data)
        console.log(data)
        res.send('done!')
    } else if (operation === "read") {
        const data = await readOperation(collection)
        res.send(data)
    } else if (operation === "update") {
        await updateOperation(collection, data)
        res.send('updated')
    } else if (operation === "delete") {
        await deleteOperation(collection, data)
        res.send('deleted')
    }
    else{
        res.send("Invalid operation")
    }
}