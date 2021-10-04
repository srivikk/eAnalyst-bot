const { getAnswerFromBot, getResponseToBot } = require('./services/bot-services/bot-service');
const projectId = process.env.PROJECT_ID;

exports.welcomeMessage = async (req, res) => {
    let response = await getAnswerFromBot(projectId, 'hi')
    res.send(response)
}


exports.chatService = async (req, res) => {
    let context = req.body.data;
    let response = await getAnswerFromBot(projectId, context)
    res.send(response)
}

exports.webhookService = async (req, res) => {

    let response = await getResponseToBot(req, res)
    res.send(response)
}