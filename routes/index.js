const express = require('express');
const router = express.Router();
const { WebhookClient, Payload } = require('dialogflow-fulfillment');

router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;
