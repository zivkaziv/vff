import {send, request} from './utils/messenger.js';
import {setup} from './core/vffSetup';
import {READY} from './utils/events.js';
import {vffData} from './core/vffData.js';
import {start as startListener} from './utils/listener';
import {init as initVffDom} from './core/initDOM';
import vffElement from './core/vffElement';
import './core/defaultExpose';
import "../scripts/custom-elements.min";
import "../scripts/custom-elements-es5-adapter.exec";
import {isMobile, extend, defer, uuid} from './utils/helpers';
import * as eventsApi from './core/api/events';
import * as playerApi from './core/api/player';
import * as httpApi from './core/api/http';
import {bindSyncEvents} from './core/interactionEvents';
import {MODE} from './core/consts';
import * as noOverScroll from './utils/noOverscroll';

startListener();
initVffDom();

window.addEventListener('load', () => {
    send(READY);
});


let vff = (selector) => {
    return new vffElement(selector);
};


vff.registerControl     = (name, value, options) => {return vffData.registerControl(name, value, options);};
vff.registerControls    = (object, options) => {return vffData.registerControls(object, options);};
vff.updateControl       = (name, value, options) => {return vffData.updateControl(name, value, options);};
vff.getControl          = (name) => {return vffData.getControl(name);};
vff.ready               = (cb) => {return vffData.ready(cb);};


vff.onUpdate            = (cb) => {return vffData.onUpdate(cb);};
vff.getPages            = () => {return vffData.getPages();};
vff.onPages             = (cb) => {return vffData.onPages(cb);};
vff.on                  = (namespace, cb, options) => {return vffData.on(namespace, cb, options);};
vff.getQueryParams      = () => {return vffData.getQueryParams();};
vff.send                = (type, payload) => { send(type, payload); };
vff.request             = (type, payload, cb) => { request(type, payload, cb); };
vff.setup               = (options) => {return setup(options);};
vff.isMobile            = isMobile;
vff.isController        = () => {return vff.mode === MODE.PREVIEW || vff.mode === MODE.PROGRAM;};
vff.mode                = MODE.NORMAL;
vff.MODE                = MODE; //Enum
vff.defer               = defer;
vff.extend              = (name, extension) => { vff[name] = extension; };
vff.define              = (name, element) => { customElements.define(name, element); };
vff.uuid                = uuid();
vff.sync                = (element) => { bindSyncEvents(element); };
vff.enableOverscroll    = () => {noOverScroll.disable();}; //Enabled by default
vff.disableOverscroll   = () => {noOverScroll.enable();}; //When disabled, body is not scrollable


extend(vff, playerApi);
extend(vff, eventsApi);




vff.extend('http', httpApi);


module.exports = vff;