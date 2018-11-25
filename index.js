/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const TelecomandoHandler = {

    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        console.log('******* REQUEST ********', JSON.stringify(request));
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest' && request.intent.name === 'change_channel')
            || (request.type === 'IntentRequest' && request.intent.name === 'turn_off');
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        let speechOutput = 'Non ho capito';
        
        if(request.type == 'IntentRequest') {
            switch(request.intent.name) {
                case 'change_channel':
                    const channelNumber = request.intent.slots.channel.value;
                    speechOutput = `Metto su canale ${channelNumber}`;
                    LG.changeChannel(channelNumber);
                    break;
                case 'turn_off':
                    speechOutput= 'Spengo la tv';
                    // LG.turnOff();
                    break;
            }
        }
        
        LG.sendMessage(speechOutput);
        
        return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard('Telecomando', speechOutput)
        .getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(HELP_MESSAGE)
            .reprompt(HELP_REPROMPT)
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(STOP_MESSAGE)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, an error occurred.')
            .reprompt('Sorry, an error occurred.')
            .getResponse();
    },
};

const LG = {

    connectAndRun(fn) {
        const lgtv = require("lgtv2")({
            url: 'ws://192.168.1.109:3000'
        });

        lgtv.on('error', function (err) {
            console.log(err);
        });

        lgtv.on('connect', function () {
            fn(lgtv);
        });
    },

    sendMessage(message) {
        this.connectAndRun(tv => tv.request('ssap://system.notifications/createToast', {message}));
    },

    turnOff() {
        this.connectAndRun(tv => tv.request('ssap://system/turnOff', function (err, res) {tv.disconnect();}));
    },

    changeChannel(channelNumber) {
        this.connectAndRun(tv => {
            tv.request('ssap://tv/getChannelList', (err, res) => {
                const foundChannel = res.channelList.find(i => i.channelNumber == channelNumber); 
                if(foundChannel) {
                    const { channelId, channelName } = foundChannel;
                    tv.request('ssap://tv/openChannel', {channelId});
                }
            });
        });
    }
}

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    .addRequestHandlers(
        TelecomandoHandler,
        HelpHandler,
        ExitHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();

