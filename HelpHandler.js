const HELP_MESSAGE  = 'Puoi chiedermi di cambiare canale o di spegnere la televisione.';
const HELP_REPROMPT = 'Se non riesci usa un vero telecomando.';

class HelpHandler {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    }

    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(HELP_MESSAGE)
            .reprompt(HELP_REPROMPT)
            .getResponse();
    }
}

module.exports = HelpHandler;
