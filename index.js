const Alexa = require('ask-sdk');
const LG = require('./LG');
const TelecomandoHandler = require('./TelecomandoHandler');
const HelpHandler = require('./HelpHandler');
const ExitHandler = require('./ExitHandler');

const skillBuilder = Alexa.SkillBuilders.standard();

const lg = new LG(process.env.LG_TV_IP);

exports.handler = skillBuilder
    .addRequestHandlers(
        new TelecomandoHandler(lg),
        new HelpHandler(),
	    new ExitHandler()
    )
    .lambda();

