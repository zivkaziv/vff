import {broadcast} from '../../utils/helpers.js';
import {vffData} from '../vffData.js';
import {isInteractionEvent, dispatchEvent} from '../interactionEvents';
import {VFF_EVENT} from '../../utils/events';
import {NAMESPACE_DELIMITER, EXPOSE_DELIMITER, TIMECODE} from '../consts';


async function update(data){
    let timecode, globalChange = false, promises = [], templateChange = {};
    return new Promise((resolve, reject) => {
        for(let templateName in data){
            for(let key in data[templateName]) {
                if(key !== TIMECODE){
                    if(!timecode) timecode = data[templateName].__timecode__;
                    promises.push(new Promise((resolve, reject) => {
                        let controlName = `${templateName}${NAMESPACE_DELIMITER}${key}`;

                        vffData._updateControl(controlName, data[templateName][key], {timecode}).then(controlChange => {
                            templateChange[templateName] = controlChange || templateChange[templateName];
                            if(controlName.includes(EXPOSE_DELIMITER)){
                                templateChange[controlName.split(EXPOSE_DELIMITER)[0]] = controlChange || templateChange[controlName.split(EXPOSE_DELIMITER)[0]];
                            }
                            globalChange = controlChange || globalChange;
                            broadcast(VFF_EVENT + controlName.toLowerCase(), { dataChanged: controlChange, timecode, data : data[templateName][key]});
                            resolve();
                        }, reject);
                    }));
                }
            }
        }

        Promise.all(promises).then(()=>{
            for(let templateName in data){
                broadcast(VFF_EVENT + templateName.toLowerCase(), {dataChanged: templateChange[templateName], timecode, data: data[templateName]});

                let exposed = groupExposedControls(data[templateName]);
                for(let key in exposed){
                    broadcast(VFF_EVENT + templateName.toLowerCase() + NAMESPACE_DELIMITER + key.toLowerCase(), {dataChanged: templateChange[templateName + NAMESPACE_DELIMITER + key], timecode, data: exposed[key]});
                }

            }
            broadcast(VFF_EVENT, {dataChanged: globalChange, timecode, data});
            resolve();
        }, reject);
    });
}

function groupExposedControls(data){
    let exposed = {};
    for(let key in data){
        if(key.includes(EXPOSE_DELIMITER)){
            let parts = key.split(EXPOSE_DELIMITER);
            let name = parts[0], prop = parts[1];
            exposed[name] = exposed[name] || {};
            exposed[name][prop] = data[key];
        }
    }
    return exposed;
}

function updateInteraction(data){
    for(let event in data){
        if(isInteractionEvent(event)){
            dispatchEvent(event, data[event]);
        }
    }
}

module.exports = {
    update : update,
    updateInteraction : updateInteraction
};