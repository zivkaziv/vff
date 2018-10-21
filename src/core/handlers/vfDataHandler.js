import {updateInteraction} from './updateHandler';
import WebRTC from '../webrtc/webrtc';

function handleVFData(data) {
    if(data.settings.sync && !window.webrtc) {
        // window.webrtc.close();
        window.webrtc = new WebRTC(data.token, 'sync', {
            onMessage: function (message) {
                updateInteraction(message);
            }
        });
    }

}

module.exports = {
    handleVFData : handleVFData
};
