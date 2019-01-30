class SessionRequestHandler {
    canHandle(handlerInput) {
	const request = handlerInput.requestEnvelope.request;
	return request.type === 'SessionEndedRequest';
    }

    handle(handlerInput) {
	return handlerInput.responseBuilder.getResponse();
    }
}

module.exports = SessionRequestHandler;
