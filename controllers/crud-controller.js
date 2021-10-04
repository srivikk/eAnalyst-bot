const { readOperation } = require('./services/mongo-service/mongo-service')

exports.crudController = async (req, res) => {
    const collection = req.params.collection;
    const body = req.body.name;
    const operation = req.query.operation

    if (operation === "read") {
        const data = await readOperation(collection,body)
        res.send(data)
    }
}