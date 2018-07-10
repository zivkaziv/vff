import {ADD} from "../utils/events";
import {docRef} from '../utils/helpers.js';
import {send} from '../utils/messenger';
import {REGISTER_TEMPLATE} from '../utils/docRefs';
import VffTemplate from './vffTemplate';

class VffData {
    constructor(){
        this._templates = {};
        this._pages = [];
    }

    updateCB(){
        if(this._updateCB) {
            this._updateCB();
        }
        if(window.angular){
            let $body = window.angular.element(document.body);
            let $injector = $body.injector();
            if($injector){
                $injector.get('$rootScope').$apply();
            }
        }
    }

    onUpdate(cb){
        this._updateCB = cb;
    }

    registerTemplate(name, data){
        if(arguments.length < 2){
            throw new Error('Missing Arguments, please refer to: ' + docRef(REGISTER_TEMPLATE));
        }

        data = data || {};
        name = name.toLowerCase();

        if(this._templates[name]){
            this._templates[name].addData(data);
        } else {
            this._templates[name] = new VffTemplate(name,data);
        }

        send(ADD,{
            channel : name,
            data    : data
        });

        return this._templates[name];
    }

    getTemplate(name){
        return this._templates[name.toLowerCase()];
    }
    getTemplates(){
        return Object.values(this._templates);
    }


    addTemplate(name, data){
        return this.registerTemplate(name, data);
    }

    show(template){
        this.getTemplate(template).show();
    }
    hide(template){
        this.getTemplate(template).hide();
    }
    toggle(template){
        this.getTemplate(template).toggle();
    }
    clear(){
        this._templates = {};
    }
    addPages(pages){
        if(pages && pages.length){
            while (this._pages.length) { this._pages.pop(); }
            this._pages = this._pages.concat(pages);
            this.updateCB();
        }
    }
    getPages(){
        return this._pages;
    }
    addQueryParams(params){
        this._queryParams = params;
        this.updateCB();
    }
    getQueryParams(){
        return this._queryParams;
    }
}


export let vffData = new VffData();