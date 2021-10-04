const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    department_id: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    supplier_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'supplier' }]
})

module.exports = mongoose.model('department', departmentSchema, 'department');