class TelecomandoHandler {

    constructor(lg) {
        this.lg = lg;
    }

    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        console.log('******* REQUEST ********', JSON.stringify(request));
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest' && request.intent.name === 'change_channel')
            || (request.type === 'IntentRequest' && request.intent.name === 'turn_off');
    }

    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        let speechOutput = 'Non ho capito';
        
        if(request.type == 'IntentRequest') {
            switch(request.intent.name) {
                case 'change_channel':
                    const channelNumber = request.intent.slots.channel.value;
                    speechOutput = `Metto su canale ${channelNumber}`;
                    this.lg.changeChannel(channelNumber);
                    break;
                case 'turn_off':
                    speechOutput= 'Spengo la tv';
                    this.lg.turnOff();
                    break;
            }
        }
        
        this.lg.sendMessage(speechOutput);
        
        return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard('Telecomando', speechOutput)
        .getResponse();
    }
};

module.exports = TelecomandoHandler;
