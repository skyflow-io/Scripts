import Helper from './Helper.js';

/**
 * Skyflow DomElement
 *
 * @class DomElement
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 */
export default class DomElement {

    // Todo : Doc for attributes.

    /**
     * Constructor.
     *
     * @method constructor
     * @param {HTMLElement} element Must be a DOM element or a valid CSS selector.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    constructor(element) {

        let node = element;

        if(Helper.isString(node)){
            node = document.querySelector(node);
        }

        if(!Helper.isElement(node)){
            console.error('SkyflowDomCreatorElementError: Element must be a Element.');
            return this;
        }

        this.element = node;

        this.uniqueId = Helper.generateUniqueId(10);
        this.addData('skyflow-unique-id', this.uniqueId);

        this.events = {
           // '6778742212': {
           //     'click': [()=>{}, ()=>{}]
           // }
        };

        this.eventCallback = (e)=>{

            if(e.type === 'mouseover' || e.type === 'mouseout'){
                let related = e.relatedTarget || e[(e.type === 'mouseout') ? 'toElement' : 'fromElement'] || null;
                if(Helper.isChildOf(related, this.element) || Helper.isChildOf(e.target, this.element)){
                    return false;
                }
            }

            if(!this.events[this.uniqueId]){
                return false;
            }

            let callbacks = this.events[this.uniqueId][e.type] || [];
            callbacks.map((callback)=>{
                callback.apply(null, [e]);
            });

        };


    }

    /**
     * Sets or get id of element.
     *
     * @method id
     * @param {String|null} id Id of element.
     * @since 1.0.0
     * @returns {String|DomElement} Returns an instance of DomElement object.
     */
    id(id = null){
        if(!id){
            return this.element.id;
        }
        this.element.id = '' + id;

        return this;
    }

    /**
     * Sets or get text content of element.
     *
     * @method id
     * @param {String|null} text Text content of element.
     * @since 1.0.0
     * @returns {String|DomElement} Returns an instance of DomElement object.
     */
    text(text = null){
        if(!text){
            return this.element.textContent;
        }
        this.element.textContent = '' + text;

        return this;

    }

    /**
     * Sets or get text content of element.
     *
     * @method html
     * @param {String|null} html HTML content of element.
     * @since 1.0.0
     * @returns {String|DomElement} Returns an instance of DomElement object.
     */
    html(html = null){
        if(!html){
            return this.element.innerHTML;
        }
        this.element.innerHTML = '' + html;

        return this;
    }

    /**
     * Sets DomElement position. Needed placement must be set.
     *
     * @method data
     * @param {Object} data Data to set.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    data(data){
        Object.keys(data).map((key)=>{
            this.addData(key, data[key])
        });

        return this;
    }

    /**
     * Adds data to element.
     *
     * @method addData
     * @param {String} key Key of data.
     * @param {String} value Value of data.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    addData(key, value){

        key = Helper.camelCase(key);
        this.element.dataset[key] = value;

        return this;
    }

    /**
     * Gets data value.
     *
     * @method getData
     * @param {String} key Key of data.
     * @since 1.0.0
     * @returns {String} Returns data value.
     */
    getData(key){
        return this.element.dataset[Helper.camelCase(key)];
    }

    /**
     * Gets child.
     *
     * @method getChild
     * @param {String} selector CSS selector.
     * @since 1.0.0
     * @returns {DomElement|null} Returns an instance of DomElement object.
     */
    getChild(selector){
        const child = this.element.querySelector(selector);

        return child ? new DomElement(child) : null;
    }

    /**
     * Gets or sets first child.
     *
     * @method firstChild
     * @param {HTMLElement|null} child HTML Element. Returns DomElement for first child if child is null.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    firstChild(child = null){

        const first = this.element.firstElementChild;
        if(!child){
            return first ? new DomElement(first) : null;
        }
        if(!first){
            this.element.appendChild(child);
            return this;
        }
        this.element.insertBefore(child, first);

        return this;
    }

    /**
     * Gets or sets last child.
     *
     * @method lastChild
     * @param {HTMLElement|null} child HTML Element. Returns DomElement for last child if child is null.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    lastChild(child = null){

        if(!child){
            const last = this.element.lastElementChild;
            return last ? new DomElement(last) : null;
        }
        this.element.appendChild(child);

        return this;
    }

    /**
     * Adds child to element.
     *
     * @method addChild
     * @param {HTMLElement} child HTML Element.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    addChild(child){
        this.element.appendChild(child);

        return this;
    }

    /**
     * Gets children of element.
     *
     * @method children
     * @since 1.0.0
     * @returns {DomElement[]} Returns collection of DomElement instance.
     */
    children(){

        let children = Helper.convertToArray(this.element.children);
        if(!children){
            return null
        }

        let elements = [];

        children.map((child)=>{
            elements.push(new DomElement(child));
        });

        return elements;
    }

    /**
     * Inserts this element into another.
     *
     * @method insertInto
     * @param {HTMLElement|String} container HTML Element or CSS selector. Must be an element from the DOM.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    insertInto(container){
        if(Helper.isString(container)){
            container = document.querySelector(container);
        }
        container.appendChild(this.element);

        return this;
    }

    /**
     * Removes element from the DOM.
     *
     * @method remove
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    remove(){
        const parent = this.element.parentNode;
        if(parent){
            parent.removeChild(this.element);
        }

        return this;
    }

    /**
     * Adds class to element.
     *
     * @method addClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    addClass(name){
        this.element.classList.add(name);

        return this;
    }

    /**
     * Removes class from element.
     *
     * @method removeClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    removeClass(name){
        this.element.classList.remove(name);

        return this;
    }

    /**
     * Toggles class of element.
     *
     * @method toggleClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    toggleClass(name){
        this.element.classList.toggle(name);

        return this;
    }

    /**
     * Checks if element has class.
     *
     * @method hasClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Boolean} Returns true if has class and false otherwise.
     */
    hasClass(name){
        return this.element.classList.contains(name);
    }


    /**
     * Adds style to element.
     *
     * @method addStyle
     * @param {String} name Name of style.
     * @param {String} value Value of style.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    addStyle(name, value){
        this.element.style[name] = value;

        return this;
    }

    /**
     * Removes style from element.
     *
     * @method removeStyle
     * @param {String} name Name of style.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    removeStyle(name){
        this.element.style[name] = null;

        return this;
    }

    /**
     * Sets events for element.
     *
     * @method on
     * @param {String} event Event name.
     * @param {Function} callback Function to trigger.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    on(event, callback){

        if(!Helper.isCallback(callback)){
            return this;
        }

        if(!this.events[this.uniqueId]){
            this.events[this.uniqueId] = {};
        }

        if(!this.events[this.uniqueId][event]){
            this.events[this.uniqueId][event] = [];
            Helper.addEvent(this.element, event, this.eventCallback);
        }
        this.events[this.uniqueId][event].push(callback);

        return this;
    }

    /**
     * Removes events for element.
     *
     * @method off
     * @param {String} event Event name.
     * @param {Function} callback Function to trigger.
     * @since 1.0.0
     * @returns {DomElement} Returns an instance of DomElement object.
     */
    off(event, callback = null){

        if(!this.events[this.uniqueId] || !this.events[this.uniqueId][event]){
            return this;
        }

        if(!Helper.isCallback(callback)){
            delete this.events[this.uniqueId][event];
        }

        // Todo : Remove event with specific callback

        return this;
    }

}
