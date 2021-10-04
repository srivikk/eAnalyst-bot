var express = require('express');
var router = express.Router();

const { chatService, welcomeMessage, webhookService } = require('../controllers/app-controller');

router.get('/welcomeMessage', welcomeMessage);
router.post('/chatService', chatService);

router.post('/webhookService', webhookService);

module.exports = router;