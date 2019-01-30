const STOP_MESSAGE = 'Goodbye!';

class ExitHandler {

    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    }

    handle(handlerInput) {
	return handlerInput.responseBuilder
	    .speak(STOP_MESSAGE)
	    .getResponse();
    }
}

module.exports = ExitHandler;
