const express = require('express');
const router = express.Router();

const {
    crudController
} = require('../controllers/crud-controller');

router.post('/crud/:collection', crudController);

module.exports = router;