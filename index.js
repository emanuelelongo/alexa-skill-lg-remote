const Alexa = require('ask-sdk');
const LG = require('./LG');
const TelecomandoHandler = require('./TelecomandoHandler');
const HelpHandler = require('./HelpHandler');
const ExitHandler = require('./ExitHandler');

const skillBuilder = Alexa.SkillBuilders.standard();

const lg = new LG("192.168.1.4");

exports.handler = skillBuilder
    .addRequestHandlers(
        new TelecomandoHandler(lg),
        new HelpHandler(),
	    new ExitHandler()
    )
    .lambda();

