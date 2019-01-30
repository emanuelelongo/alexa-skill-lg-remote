const LgTv2 = require("lgtv2");

class LG {
    constructor(ip) {
        this.subscribers = [];
        this.ready = false;

        this.lg = LgTv2({
            url: `ws://${ip}:3000`
        });

        this.lg.on('error', err => {
            console.log(err);
        });

        this.lg.on('connect', () => {
            this.ready = true;
            this.subscribers.map(i => i(this.lg));
            this.subscribers = [];
        });
    }

    whenReady(fn) {
        if(this.ready) 
            fn(this.lg);
        else
            this.subscribers.push(fn);
    }
    
    sendMessage(message) {
        this.whenReady(tv => tv.request('ssap://system.notifications/createToast', {message}));
    }

    turnOff() {
        this.whenReady(tv => tv.request('ssap://system/turnOff', (err, res) => tv.disconnect()));
    }

    changeChannel(channelNumber) {
        this.whenReady(tv => {
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

module.exports = LG;

