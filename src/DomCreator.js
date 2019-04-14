import Helper from './Helper.js';
import DomElement from './DomElement.js';

/**
 * Skyflow DomCreator
 *
 * @class DomCreator
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @requires DomElement
 */
export default class DomCreator {

    // Todo : Doc for attributes.


    /**
     * Constructor.
     *
     * @method constructor
     * @since 1.0.0
     * @return {DomCreator} Returns an instance of DomCreator object.
     */
    constructor() {

        this.elements = {

        };

    }

    /**
     * Creates element.
     *
     * @method createElement
     * @param {String} name Name of element.
     * @param {String} type Type of element ('input', 'button', ...). If isTemplate equals true, this value can be "<button>...</button>"
     * * @param {Boolean} isTemplate
     * @since 1.0.0
     * @return {DomCreator} Returns an instance of DomCreator object.
     */
    createElement(name, type, isTemplate = false){

        let element = null;

        if(isTemplate){
            let div = document.createElement('div');
            div.innerHTML = type;
            element = div.firstElementChild;

        }else {
            element = document.createElement(type);
        }

        this.elements[name] = new DomElement(element);

        return this;
    }

    /**
     * Inserts elements into container.
     *
     * @method insertInto
     * @param {HTMLElement|String} container HTML Element or CSS selector. Must be an element from the DOM.
     * @since 1.0.0
     * @return {DomCreator} Returns an instance of DomCreator object.
     */
    insertInto(container){

        Object.keys(this.elements).map((key)=>{
            this.elements[key].insertInto(container);
        });

        return this;
    }

    /**
     * Gets element by its name.
     *
     * @method get
     * @param {String} name Name of element.
     * @since 1.0.0
     * @return {DomElement} Returns an instance of DomElement object.
     */
    get(name){
        return this.elements[name] || null;
    }


}
