const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
    supplier_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    manager_name: {
        type: String,
        required: true,
    },
    spending: {
        type: Number
    },
    revenue: {
        type: Number
    },
    location: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('supplier', supplierSchema, 'supplier');