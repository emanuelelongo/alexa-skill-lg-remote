const Alexa = require('ask-sdk');
const lg = require('./LG')("192.168.1.4");
const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    .addRequestHandlers(
        new TelecomandoHandler(lg),
        new HelpHandler()
    )
    .lambda();

