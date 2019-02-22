/**
 * Skyflow Helper - Various useful functions.
 *
 * @class Helper
 * @static
 * @author Skyflow
 * @version 1.0.0
 * @example
 *      Heller.isElement(document.createElement('div')); // Returns true
 *      Heller.isObject({}); // Returns true
 */
export default class Helper {

    /**
     * Gets type of any object.
     *
     * @method getType
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {String} Returns the type of object.
     */
    static getType(object) {
        if (object === null) {
            return null
        }
        let t = (typeof object);
        if (t === 'object') {
            object = String(object.constructor);
            if (/^(?:function|object) ([a-z0-9-]+)\(?/i.test(object)) {
                t = RegExp.$1;
                if (/^html[a-z]*element$/i.test(t)) {
                    t = 'Element'
                }
            } else {
                t = undefined
            }
        }

        return t;
    }

    /**
     * Checks if an object is a string.
     *
     * @method isString
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a string and false otherwise.
     */
    static isString(object) {
        return this.getType(object) === 'string';
    }

    /**
     * Checks if an object is a number.
     *
     * @method isNumber
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a number and false otherwise.
     */
    static isNumber(object) {
        return this.getType(object) === 'number';
    }

    /**
     * Checks if an object is a array.
     *
     * @method isArray
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a array and false otherwise.
     */
    static isArray(object) {
        return this.getType(object) === 'Array';
    }

    /**
     * Checks if an object is a object.
     *
     * @method isObject
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a object and false otherwise.
     */
    static isObject(object) {
        return this.getType(object) === 'Object';
    }

    /**
     * Checks if an object is a boolean.
     *
     * @method isBoolean
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a boolean and false otherwise.
     */
    static isBoolean(object) {
        return this.getType(object) === 'boolean';
    }

    /**
     * Checks if an object is a DOM element.
     *
     * @method isElement
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a DOM element and false otherwise.
     */
    static isElement(object) {
        return this.getType(object) === 'Element';
    }

    /**
     * Checks if an object is a function.
     *
     * @method isFunction
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a function and false otherwise.
     */
    static isFunction(object) {
        return this.getType(object) === 'function';
    }

    /**
     * Checks if an object is a function.
     *
     * @method isCallback
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a function and false otherwise.
     */
    static isCallback(object) {
        return this.isFunction(object);
    }

    /**
     * Checks if an object is a FormData.
     *
     * @method isFormData
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is a FormData and false otherwise.
     */
    static isFormData(object) {
        return this.getType(object) === 'FormData';
    }

    /**
     * Checks if an object is empty.
     *
     * @method isEmpty
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true for empty array, string, object, false, undefined, 0, null, NaN and false otherwise.
     */
    static isEmpty(object) {
        if (!object) {
            return true
        }
        for (let k in object) {
            if (object.hasOwnProperty(k)) {
                return false
            }
        }

        if (object === true || this.isNumber(object)) {
            return false;
        }

        return true;
    }

    /**
     * Checks if an object is null.
     *
     * @method isNull
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is null and false otherwise.
     */
    static isNull(object) {
        return object === null;
    }

    /**
     * Checks if an object is false.
     *
     * @method isFalse
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is false and false otherwise.
     */
    static isFalse(object) {
        return object === false;
    }

    /**
     * Checks if an object is true.
     *
     * @method isTrue
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is true and false otherwise.
     */
    static isTrue(object) {
        return object === true;
    }

    /**
     * Checks if a string is blank.
     *
     * @method isBlank
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the string is blank and false otherwise.
     */
    static isBlank(object) {
        return this.isString(object) && object.trim() === '';
    }

    /**
     * Checks if an object is regular expression.
     *
     * @method isRegExp
     * @param object Object we want to know the type.
     * @since 1.0.0
     * @returns {Boolean} Returns true if the object is regular expression and false otherwise.
     */
    static isRegExp(object) {
        return this.getType(object) === 'RegExp';
    }

    /**
     * Converts an object to array.
     *
     * @method convertToArray
     * @param object Object to convert.
     * @since 1.0.0
     * @returns {Array} Returns the resulting array.
     */
    static convertToArray(object) {

        if (this.isObject(object)) {
            return Object.keys(object);
        }

        return [].slice.call(object);

    }

    /**
     * Inserts one element after another.
     *
     * @method insertAfter
     * @param {Element} element Element to insert.
     * @param {Element} afterElement Insert an element after this one.
     * @since 1.0.0
     * @returns {boolean} Returns true if everything went well and false otherwise.
     */
    static insertAfter(element, afterElement) {
        const parent = afterElement.parentNode;
        if (!parent) {
            return false
        }
        const next = afterElement.nextElementSibling;
        if (next) {
            parent.insertBefore(element, next)
        } else {
            parent.appendChild(element)
        }
        return true;
    }

    /**
     * Checks if an element is child of another.
     *
     * @method isChildOf
     * @param {Element} child Element to check.
     * @param {Element} parent Container element.
     * @return {boolean}
     */
    static isChildOf(child, parent) {

        while (child = (child ? child.parentNode : null)) {
            if (child === parent) {
                return true
            }
        }

        return false
    }

    /**
     * Converts the first character of string to lower case.
     *
     * @method lowerFirst
     * @param {String} text The string to convert.
     * @since 1.0.0
     * @returns {String} Returns the converted string.
     */
    static lowerFirst(text) {
        return (text.slice(0, 1)).toLowerCase() + text.slice(1);
    }

    /**
     * Converts the first character of string to upper case.
     *
     * @method upperFirst
     * @param {String} text The string to convert.
     * @since 1.0.0
     * @returns {String} Returns the converted string.
     */
    static upperFirst(text) {
        return (text.slice(0, 1)).toUpperCase() + text.slice(1);
    }

    /**
     * Converts text to camelCase.
     *
     * @method camelCase
     * @param {String} text The string to convert.
     * @since 1.0.0
     * @returns {String} Returns the converted string.
     */
    static camelCase(text) {
        return text.replace(/\s(.)/g, ($1) => {return $1.toUpperCase();})
            .replace(/\-(.)/g, ($1) => {return $1.toUpperCase();})
            .replace(/\s/g, '').replace(/\-/g, '')
            .replace(/^(.)/, ($1) => {return $1.toLowerCase();});
    }

    /**
     * Converts text to slug.
     *
     * @method slugify
     * @param {String} text The string to convert.
     * @since 1.0.0
     * @returns {String} Returns the converted string.
     */
    static slugify(text) {
        return text.toLowerCase()
            .replace(/[\u00C0-\u00C5]/ig, 'a')
            .replace(/[\u00C8-\u00CB]/ig, 'e')
            .replace(/[\u00CC-\u00CF]/ig, 'i')
            .replace(/[\u00D2-\u00D6]/ig, 'o')
            .replace(/[\u00D9-\u00DC]/ig, 'u')
            .replace(/[\u00D1]/ig, 'n')
            .replace(/[^a-z0-9 ]+/gi, '')
            .trim().replace(/ /g, '-')
            .replace(/[\-]{2}/g, '')
            .replace(/[^a-z\- ]*/gi, '');
    }

    /**
     * Truncates a string.
     *
     * @method ellipsis
     * @param {String} text The string to truncate.
     * @param {Number} count Number of char.
     * @since 1.0.0
     * @returns {String} Returns the truncated string.
     */
    static ellipsis(text, count = 12) {
        return (text.length > count) ? text.substring(0, count) + '...' : text;
    }

    /**
     * Checks if an object has a property.
     *
     * @method hasProperty
     * @param {Object} object Object.
     * @param {String} property Property to check.
     * @since 1.0.0
     * @returns {Boolean} Returns true if object has property and false otherwise.
     */
    static hasProperty(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }

    /**
     * Adds event to element.
     *
     * @method addEvent
     * @param {Element|Document} element Target element.
     * @param {String} event Event to add.
     * @param {Function} callback Event callback.
     * @since 1.0.0
     * @returns {void}
     */
    static addEvent(element, event, callback) {
        if (element.addEventListener) {
            element.addEventListener(event, callback, false);
        } else {
            element.attachEvent('on' + event, callback);
        }
    }

    /**
     * Removes event.
     *
     * @method removeEvent
     * @param {Element|Document} element Target element.
     * @param {String} event Event to remove.
     * @param {Function} callback Event callback.
     * @since 1.0.0
     * @returns {void}
     */
    static removeEvent(element, event, callback) {
        if (element.removeEventListener) {
            element.removeEventListener(event, callback, false);
        } else {
            element.detachEvent('on' + event, callback);
        }
    }

    /**
     * Generates unique id.
     *
     * @method generateUniqueId
     * @param {Number} count Lenght of id.
     * @since 1.0.0
     * @returns {Number} Returns generated id.
     */
    static generateUniqueId(count = 5) {
        return Math.floor(Math.random() * Math.pow(10, count));
    }


    static removeFromArrayById(array, index){
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    static randomInt(max){
        return Math.floor(Math.random() * Math.floor(max));
    }


    /**
     * Check if platform is windows.
     *
     * @method isWindows
     * @since 1.0.0
     * @returns {Boolean} Returns true if the platform is windows and false otherwise.
     */
    static isWindows() {
        return process.platform === 'win32';
    }

    /**
     * Check if platform is linux.
     *
     * @method isLinux
     * @since 1.0.0
     * @returns {Boolean} Returns true if the platform is linux and false otherwise.
     */
    static isLinux() {
        return process.platform === 'linux';
    }

    /**
     * Check if platform is mac.
     *
     * @method isMac
     * @since 1.0.0
     * @returns {Boolean} Returns true if the platform is mac and false otherwise.
     */
    static isMac() {
        return process.platform === 'darwin';
    }

    /**
     * Check if platform is linux or mac.
     *
     * @method isInux
     * @since 1.0.0
     * @returns {Boolean} Returns true if the platform is linux or mac and false otherwise.
     */
    static isInux() {
        return this.isLinux() || this.isMac();
    }

    /**
     * Get current user directory.
     *
     * @method getUserHome
     * @since 1.0.0
     * @returns {String} Returns true if the platform is windows and false otherwise.
     */
    static getUserHome() {
        return process.env[this.isWindows() ? 'USERPROFILE' : 'HOME'];
    }

    /**
     * Generate random hexadecimal color code.
     * @method randomColor
     * @since 1.0.0
     * @returns {String} Returns a random hexadecimal color code.
     */
    static randomColor() {
        return '#' + ('0123456789abcdef'.split('').map((v, i, a) => {
            return i > 5 ? null : a[Math.floor(Math.random() * 16)] }).join('')).toUpperCase();
    }
}
