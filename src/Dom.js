(function (W) {
    /**
     * Todo :
     *  - Manage window and document objects
     *
     */

    let currentId = parseInt(Math.random() * 1000000);
    let uniqueIdName = "data-skyflow-id";

    let elementsStorage = {},
        eventsStorage = {};

    const CACHE = {
            get(key) {

                CACHE.set(key);

                let nodeLists = [], keys = key.split(",");

                keys.forEach((key) => {
                    key = key.trim();
                    let nodeList = elementsStorage[key];
                    if (nodeList) {
                        nodeLists = nodeLists.concat(nodeList);
                    }
                });

                return nodeLists;
            },
            set(key) {

                let keys = (key + "").split(","), state = false;

                keys.forEach((key) => {
                    key = key.trim();
                    if (!elementsStorage[key]) {
                        let nodeList = document.querySelectorAll(key);
                        if (nodeList[0]) {
                            elementsStorage[key] = Array.prototype.slice.call(nodeList);
                            state = true;
                        }
                    }
                });

                return state;
            },
            setWithAlias(key, alias) {

                let state = false;

                if (!elementsStorage[alias]) {
                    let nodeLists = document.querySelectorAll(key);
                    if (nodeLists[0]) {
                        elementsStorage[alias] = Array.prototype.slice.call(nodeLists);
                        state = true;
                    }
                }

                return state;
            },
            remove(key) {

                let keys = key.split(",");
                keys.forEach((key) => delete elementsStorage[key.trim()]);

                return true;
            },
            has(key) {
                return elementsStorage[key];
            }
        },
        BOOLEAN_ATTRIBUTES = {
            checked: 1,
            selected: 1,
            disabled: 1,
            autofocus: 1,
            required: 1,
            readOnly: 1,
        },
        EDGES = ["top", "right", "bottom", "left"],
        CSS_PROPERTIES = {
            border(element) {
                let width = getBordersStyle(element, "width"),
                    style = getBordersStyle(element, "style"),
                    color = getBordersStyle(element, "color");

                return {
                    "top": width.top + " " + style.top + " " + color.top,
                    "right": width.right + " " + style.right + " " + color.right,
                    "bottom": width.bottom + " " + style.bottom + " " + color.bottom,
                    "left": width.left + " " + style.left + " " + color.left,
                }
            },
            ["border-style"](element) {
                return getBordersStyle(element, "style")
            },
            ["border-width"](element) {
                return getBordersStyle(element, "width")
            },
            ["border-color"](element) {
                return getBordersStyle(element, "color")
            },
            margin(element) {
                return getEdgesStyle(element, "margin");
            },
            padding(element) {
                return getEdgesStyle(element, "padding");
            },
        },
        HAS_VALUE = {
            input(element, value) {
                if (value === undefined) {
                    return element.value || ''
                }
                return element.value = value;
            },
            textarea(element, value) {
                return HAS_VALUE.input(element, value)
            },
            option(element, value) {
                return HAS_VALUE.input(element, value)
            },
            button(element, value) {
                return HAS_VALUE.input(element, value)
            },
            li(element, value) {
                return HAS_VALUE.input(element, value)
            },
            meter(element, value) {
                return HAS_VALUE.input(element, value)
            },
            progress(element, value) {
                return HAS_VALUE.input(element, value)
            },
            param(element, value) {
                return HAS_VALUE.input(element, value)
            },
            select(element, value) {

                let options = [].slice.call(element.options);

                if (value === undefined) {
                    if (element.multiple) {
                        let res = [];
                        options.forEach((option) => {
                            if (option.selected) {
                                res.push(option.value)
                            }
                        });

                        return res;

                    } else {

                        let option = options[element.selectedIndex];

                        return option ? option.value : "";
                    }
                }

                if (!isArray(value)) {
                    value = [value]
                }

                options.forEach((option) => {
                    if (inArray(value, option.value)) {
                        option.selected = true
                    }
                });

            },
        },
        CUSTOM_EVENTS = {
            over: "mouseover",
            hover: "mouseover",
            mouseenter: "mouseover",
            out: "mouseout",
            mouseleave: "mouseout",
            down: 'mousedown',
            up: 'mouseup',
            enter: 'mouseover',
            leave: 'mouseout',
            move: 'mousemove',
            kp: 'keypress',
            kd: 'keydown',
            ku: 'keyup'
        },
        HOOK_EVENTS = {
            mouseover(callbackObject) {
                return !isChildOf(callbackObject.related, callbackObject.target)
            },
            mouseout(callbackObject) {
                return !isChildOf(callbackObject.related, callbackObject.target)
            }
        };

    function buildSubSelector(selector, subSelector) {
        let result = "";

        let parents = selector.split(",");
        let children = subSelector.split(",");

        parents.forEach((parent) => {

            parent = parent.trim();

            children.forEach((child) => {
                result += parent + " " + child.trim() + ", ";
            });

        });

        return result.replace(/[, ]+$/g, '');
    }

    function getType(object) {
        if (object === null) {
            return null
        }
        let t = (typeof object);
        if (t === 'object') {
            object = String(object.constructor);
            if (/^(?:function|object) ([a-z0-9-]+)\(?/i.test(object)) {
                t = RegExp.$1;
                if (/^html[a-z]*element$/i.test(t)) {
                    t = 'element'
                }
            } else {
                t = undefined
            }
        }

        return firstToLowerCase(t);
    }

    function isString(object) {
        return getType(object) === "string";
    }

    function isNumber(object) {
        return getType(object) === "number";
    }

    function isArray(object) {
        return getType(object) === "array";
    }

    function isObject(object) {
        return getType(object) === "object";
    }

    function isBoolean(object) {
        return getType(object) === "boolean";
    }

    function isElement(object) {
        return getType(object) === "element";
    }

    function isFunction(object) {
        return getType(object) === "function";
    }

    function isCallback(object) {
        return isFunction(object);
    }

    /**
     * Returns true for empty array, string, object, false, undefined, 0, null, NaN
     *
     * @param object
     * @return {boolean}
     */
    function isEmpty(object) {
        if (!object) {
            return true
        }
        for (let k in object) {
            if (object.hasOwnProperty(k)) {
                return false
            }
        }

        if (object === true || isNumber(object)) {
            return false
        }

        return true;
    }

    function insertAfter(element, afterElement) {
        let parent = afterElement.parentNode, next = afterElement.nextElementSibling;
        if (next) {
            parent.insertBefore(element, next)
        } else {
            parent.appendChild(element)
        }
        return parent;
    }

    function convertToArray(object) {

        let type = getType(object);

        if (type === "object") {
            let res = [];
            for (let o in object) {
                if (object.hasOwnProperty(o)) {
                    res.push(object[o]);
                }
            }
            return res;
        }

        if (type === "element") {
            return [object];
        }

        return [].slice.call(object);

    }

    /**
     * Check if an element map with search criteria.
     *
     * @param {HTMLElement} element
     * @param {object} options
     * @return {boolean}
     */
    function isThisElement(element, options) {

        if (!isElement(element) || !isObject(options)) {
            return false;
        }

        for (let key in options) {

            if (!options.hasOwnProperty(key)) {
                continue
            }

            if (key === "class") {
                if (!element.classList.contains(options[key])) {
                    return false;
                }
                continue;
            }

            let compareValue;
            if (key === "html") {
                compareValue = element["innerHTML"];
            } else if (key === "text") {
                compareValue = element["innerText"];
            } else if (key === "nodeName") {
                compareValue = element.nodeName.toLowerCase();
            } else {
                compareValue = element.getAttribute(key);
            }

            if (compareValue !== options[key]) {
                return false;
            }

        }

        return true;
    }

    /**
     * Extracts nodeName, id and class from selector.
     *
     * @param selector
     * @return {object}
     */
    function extractAttributes(selector) {

        if (!isString(selector) || isEmpty(selector)) {
            return {};
        }

        let res = {};

        selector = selector.replace(/([\.\#])([a-z0-9_\-]+)/gi, function (match, tag, name) {

            if (tag === "#") {
                tag = "id"
            }

            if (tag === ".") {
                tag = "class"
            }

            if (!res[tag]) {
                res[tag] = ""
            }

            res[tag] += " " + name;

            res[tag] = res[tag].trim();

            return "";
        });

        selector = selector.trim();

        if (selector !== "") {
            res["nodeName"] = selector;
        }

        return res;
    }

    /**
     * Makes the first case to lower case.
     *
     * @param str
     * @return {string}
     */
    function firstToLowerCase(str) {
        return str.substr(0, 1).toLowerCase() + str.substr(1);
    }

    function addHtmlOrText(elements, content, type, reset = true, first = false) {

        elements.forEach((element) => {

            if (reset) {
                return element[type] = content;
            }

            let html = element[type];

            if (first === true) {
                html = content + html;
            } else {
                html += content;
            }

            element[type] = html;
        });

    }

    function convertAddValue(value) {

        let children = [],
            type = getType(value);

        if (type === "string") {
            children = CACHE.get(value)
        }
        if (type === "nodeList") {
            children = convertToArray(value)
        }
        if (type === "element") {
            children = [value]
        }

        return children;
    }

    /**
     * Checks if value exists in array.
     *
     * @param {array} elements
     * @param {*} value
     * @return {boolean}
     */
    function inArray(elements, value) {
        return (elements.indexOf(value) !== -1);
    }

    /**
     * Gets values ​​of the four borders.
     *
     * @param {HTMLElement} element
     * @param {string} property Three values: width style color
     * @return {object}
     */
    function getBordersStyle(element, property) {

        let values = {}, style = window.getComputedStyle(element, null);

        for (let i = 0; i < 4; i++) {
            let edge = EDGES[i];
            values[edge] = style.getPropertyValue("border-" + edge + "-" + property)

        }

        return values;
    }

    /**
     * Gets values ​​of the four edges.
     *
     * @param {HTMLElement} element
     * @param {string} property
     * @return {object}
     */
    function getEdgesStyle(element, property) {

        let values = {}, style = window.getComputedStyle(element, null);

        EDGES.forEach((edge) => {
            values[edge] = style.getPropertyValue(property + "-" + edge)
        });

        return values;
    }

    /**
     * Gives the values of all the CSS properties of an element after applying the active stylesheets and resolving any basic computation those values may contain.
     *
     * @param {HTMLElement} element
     * @param {string} property
     * @return {*}
     */
    function getComputedStyle(element, property) {

        let value, style = window.getComputedStyle(element, null);
        if (CSS_PROPERTIES.hasOwnProperty(property)) {
            value = CSS_PROPERTIES[property](element)
        } else {
            value = style.getPropertyValue(property);
        }

        return value;
    }

    /**
     * Generates or gets unique id of an element.
     *
     * @param {HTMLElement} element
     * @return {string}
     */
    function getUniqueId(element) {
        if (!element.hasAttribute(uniqueIdName)) {
            currentId++;
            element.setAttribute(uniqueIdName, currentId + "");
        }

        return element.getAttribute(uniqueIdName)
    }

    /**
     * Checks if an element is child of another.
     *
     * @param {HTMLElement} child
     * @param {HTMLElement} parent
     * @return {boolean}
     */
    function isChildOf(child, parent) {

        while (child = child.parentNode) {
            if (child === parent) {
                return true
            }
        }

        return false
    }

    /**
     * Removes value from array.
     *
     * @param {array} elements
     * @param {*} value
     * @return {array}
     */
    function removeFromArray(elements, value) {
        let index = elements.indexOf(value);
        if (index < 0) {
            return elements
        }
        elements.splice(index, 1);

        return elements
    }

    function skyflowEventCallback(e) {

        e = e || window.event;
        let target = e.target, type = e.type;

        let uniqueId = target.getAttribute(uniqueIdName);
        if (!uniqueId) {
            return false
        }

        let callbacks = eventsStorage[uniqueId];

        if (!callbacks || !(callbacks = callbacks[type])) {
            return false
        }

        let code = e.keyCode || e.charCode || null;

        let callbackObject = {
            target: target,
            type: type,
            related: e.relatedTarget || e[(type === 'mouseout') ? 'toElement' : 'fromElement'] || null,
            code: code,
            char: code ? String.fromCharCode(code) : null,
            e: e
        };

        if (HOOK_EVENTS.hasOwnProperty(type)) {
            if (!HOOK_EVENTS[type](callbackObject)) {
                return false
            }
        }

        callbacks.forEach((callback) => {
            callback.apply(callbackObject, [callbackObject, e, target, type])
        });

        return callbackObject
    }

    /**
     * Adds events.
     *
     * @param {HTMLElement} element
     * @param {string} event
     * @param {Function} callback
     * @return {string}
     */
    function addEvent(element, event, callback) {

        let uniqueId = getUniqueId(element),
            events = event.split(",");

        events.forEach((event) => {

            event = event.trim();

            if (CUSTOM_EVENTS.hasOwnProperty(event)) {
                event = CUSTOM_EVENTS[event]
            }

            if (!eventsStorage[uniqueId]) {
                eventsStorage[uniqueId] = {};
            }

            if (!eventsStorage[uniqueId][event]) {
                eventsStorage[uniqueId][event] = [];
                if (element.addEventListener) {
                    element.addEventListener(event, skyflowEventCallback, false)
                } else {
                    element.attachEvent("on" + event, skyflowEventCallback);
                }
            }

            eventsStorage[uniqueId][event].push(callback);

        });

        return uniqueId
    }

    /**
     * Removes events.
     *
     * @param {HTMLElement} element
     * @param {string} event
     * @param {Function} callback
     * @return {boolean}
     */
    function removeEvent(element, event, callback) {

        let uniqueId = element.getAttribute(uniqueIdName);
        if (!uniqueId) {
            return false
        }

        if (!eventsStorage[uniqueId]) {
            return false
        }

        let events = [], state = false;

        if (event === undefined) {

            let eventsObject = eventsStorage[uniqueId];

            for (let key in eventsObject) {
                if (eventsObject.hasOwnProperty(key)) {
                    events.push(key)
                }
            }

        } else {
            if (CUSTOM_EVENTS.hasOwnProperty(event)) {
                event = CUSTOM_EVENTS[event]
            }
        }

        if (callback === undefined) {
            if (event !== undefined) {
                events = [event]
            }
        } else {
            let callbacks = eventsStorage[uniqueId][event];
            removeFromArray(callbacks, callback);
            if (isEmpty(callbacks)) {
                events = [event]
            }
            state = true
        }

        if (!isEmpty(events)) {

            events.forEach((event) => {
                delete eventsStorage[uniqueId][event];
                if (element.removeEventListener) {
                    element.removeEventListener(event, skyflowEventCallback, false);
                } else {
                    element.detachEvent("on" + event, skyflowEventCallback);
                }
            });

            if (isEmpty(eventsStorage[uniqueId])) {
                delete eventsStorage[uniqueId]
            }

            state = true
        }

        return state
    }

    /**
     * Triggers events.
     *
     * @param {HTMLElement} element
     * @param {string} event
     * @return {boolean}
     */
    function triggerEvent(element, event) {

        let uniqueId = element.getAttribute(uniqueIdName);
        if (!uniqueId) {
            return false
        }

        if (!eventsStorage[uniqueId]) {
            return false
        }

        let events = event.split(",");

        events.forEach((event) => {
            element.dispatchEvent(new Event(event.trim()));
        });

        return true
    }

    const METHODS = {

        /**
         * Adds events.
         *
         * @method on
         * @param {String} events List of events separated by commas.
         * @param {Function} callback
         * @return {string} String selector.
         * @example on.example.js
         */
        on(events, callback) {

            if (!isString(events) || !isCallback(callback)) {
                return this
            }

            let elements = CACHE.get(this);

            elements.forEach((element) => addEvent(element, events, callback));

            return this
        },

        /**
         * Removes events.
         *
         * @method off
         * @param {String} event List of events separated by commas to remove.
         * @param {Function} callback
         * @return {string} String selector.
         * @example off.example.js
         */
        off(event, callback) {

            let elements = CACHE.get(this);

            let events = (event + "").split(",");
            events.map((event) => {
                elements.map((element) => removeEvent(element, event.trim(), callback));
            });

            return this
        },

        /**
         * Triggers events.
         *
         * @method trigger
         * @param {String} events List of events separated by commas to trigger.
         * @return {string}
         * @example trigger.example.js
         */
        trigger(events) {

            if (!isString(events)) {
                return this
            }

            let elements = CACHE.get(this);

            elements.forEach((element) => triggerEvent(element, events));

            return this
        },

        // ===================> More details and examples <====================//

        /**
         * Gets selected elements.
         *
         * @method getSelected
         * @return {string}
         */
        getSelected() {
            let elements = CACHE.get(this), res = [];

            elements.forEach((element) => {
                if (element.selected) {
                    res.push(element);
                }
            });

            let key = "getSelected" + (currentId++);
            elementsStorage[key] = res;

            return key;
        },

        /**
         * Gets checked elements.
         *
         * @method getChecked
         * @return {string}
         */
        getChecked() {
            let elements = CACHE.get(this), res = [];

            elements.forEach((element) => {
                if (element.checked) {
                    res.push(element);
                }
            });

            let key = "getChecked" + (currentId++);
            elementsStorage[key] = res;

            return key;
        },

        /**
         * Check or uncheck elements.
         *
         * @method check
         * @param {boolean} value
         * @return {string}
         * @example check.example.js
         */
        check(value) {
            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.checked = !(value === false);
            });

            return this;
        },

        /**
         * Selects or deselects elements.
         *
         * @method select
         * @param {boolean} value
         * @return {string}
         * @example select.example.js
         */
        select(value) {
            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.selected = !(value === false);
            });

            return this;
        },

        /**
         * Sets or gets value.
         *
         * @method val
         * @param {string|array} value
         * @return {string|array}
         * @example val.example.js
         */
        val(value) {

            let elements = CACHE.get(this);

            if (value === undefined) {
                let first = elements[0];
                if (!first) {
                    return ""
                }
                let name = (first.nodeName).toLowerCase();

                return HAS_VALUE.hasOwnProperty(name) ? HAS_VALUE[name](first) : first.textContent;
            }

            elements.forEach((element) => {
                let name = (element.nodeName).toLowerCase();
                if (HAS_VALUE.hasOwnProperty(name)) {
                    HAS_VALUE[name](element, value);
                } else {
                    element.textContent = value;
                }
            });

            return this;
        },

        /**
         * Gets children of selection.
         *
         * @method children
         * @return {string}
         * @example parent.example.js
         */
        children() {

            let elements = CACHE.get(this), res = [];

            elements.forEach((element) => {
                res = res.concat([].slice.call(element.children))
            });

            let key = "children" + (currentId++);
            elementsStorage[key] = res;

            return key;
        },

        /**
         * Gets elements from selection.
         *
         * @method parent
         * @param {object|string|null} [selector]
         * @return {string}
         * @example parent.example.js
         */
        parent(selector) {

            let elements = CACHE.get(this), res = [];

            if (isString(selector)) {
                selector = extractAttributes(selector);
            }

            if (!isObject(selector)) {
                selector = false;
            }

            elements.forEach((element) => {

                if (selector) {
                    while (element = element.parentNode) {
                        if (isThisElement(element, selector) && !inArray(res, element)) {
                            res.push(element);
                            return true;
                        }
                    }
                } else {
                    let parent = element.parentNode;
                    if (parent && !inArray(res, parent)) {
                        res.push(parent)
                    }
                }

            });

            let key = "parent" + (currentId++);
            elementsStorage[key] = res;

            return key;
        },

        /**
         * Gets first element from selection.
         *
         * @method first
         * @param {object|string|null} [selector]
         * @return {string}
         */
        first(selector) {

            let elements = CACHE.get(this), res = [];

            if (elements[0]) {
                res.push(elements[0])
            }

            let key = "first" + (currentId++);
            elementsStorage[key] = res;

            return key;
        },

        /**
         * Gets elements from selection.
         *
         * @method get
         * @param {object|string} [selector]
         * @return {string|array} Return all the elements of selection if selector not given.
         * @example get.example.js
         */
        get(selector) {

            let elements = CACHE.get(this);

            if (selector === undefined) {
                return elements
            }

            if (isString(selector)) {
                selector = extractAttributes(selector);
            }

            if (!isObject(selector)) {
                return this
            }

            let res = [];

            elements.forEach((element) => {
                if (isThisElement(element, selector)) {
                    res.push(element);
                }
            });

            let key = "get" + (currentId++);
            elementsStorage[key] = res;

            return key;
        },

        /**
         * Finds elements from children of selection.
         *
         * @method find
         * @param {string} [selector]
         * @return {string|array} Return all the elements of selection if selector not given.
         */
        find(selector) {

            let elements = CACHE.get(this);

            if (selector === undefined) {
                return elements
            }

            if (!isString(selector)) {
                return this
            }

            let res = [];

            elements.forEach((element) => {
                let children = element.querySelectorAll(selector);
                res = res.concat([].slice.call(children));
            });

            let key = "find" + (currentId++);
            elementsStorage[key] = res;

            return key;
        },

        /**
         * Removes elements from selection.
         *
         * @method remove
         * @param {object|string} [selector]
         * @return {string}
         * @example remove.example.js
         */
        remove(selector) {

            let elements = CACHE.get(this), invalidate = false;

            if (isString(selector)) {
                selector = extractAttributes(selector);
            }

            if (!isObject(selector)) {
                selector = null
            }

            elements.forEach((element) => {
                if (selector === null || isThisElement(element, selector)) {
                    invalidate = true;
                    element.parentNode.removeChild(element);
                    removeEvent(element)
                }
            });

            if (invalidate) {
                CACHE.remove(this);
            }

            return this;
        },

        /**
         * Sets or gets html content.
         *
         * @method html
         * @param {string} [content]
         * @return {string}
         */
        html(content) {

            let elements = CACHE.get(this);

            if (content === undefined) {
                let first = elements[0];
                return first ? first.innerHTML : "";
            }

            addHtmlOrText(elements, content, "innerHTML");

            return this;
        },

        /**
         * Adds html content.
         *
         * @method addHtml
         * @param {string} [content]
         * @param {boolean} [first]
         * @return {string}
         */
        addHtml(content, first = false) {

            addHtmlOrText(CACHE.get(this), content, "innerHTML", false, first);

            return this;
        },

        /**
         * Sets or gets text content.
         *
         * @method text
         * @param {string} [content]
         * @return {string}
         */
        text(content) {

            let elements = CACHE.get(this);

            if (content === undefined) {
                let first = elements[0];
                return first ? first.textContent : "";
            }

            addHtmlOrText(elements, content, "textContent");

            return this;
        },

        /**
         * Adds text content.
         *
         * @method addText
         * @param {string} [content]
         * @param {boolean} [first]
         * @return {string}
         */
        addText(content, first = false) {

            addHtmlOrText(CACHE.get(this), content, "textContent", false, first);

            return this;
        },

        /**
         * Adds elements as children of selection.
         *
         * @method add
         * @param {string|NodeList|element} value
         * @return {string}
         */
        add(value) {

            let parent = CACHE.get(this)[0];

            if (!parent) {
                return this
            }

            let children = convertAddValue(value);

            children.forEach((child) => {
                parent.appendChild(child);
            });

            return this;
        },

        /**
         * Adds elements before element.
         *
         * @method addBefore
         * @param {string} selector
         * @param {string|NodeList|element} value
         * @return {string}
         */
        addBefore(selector, value) {

            let parent = CACHE.get(this)[0];
            if (!parent) {
                return this
            }

            let before = parent.querySelector(selector);
            if (!before) {
                return this
            }

            let children = convertAddValue(value);

            children.forEach((child) => {
                parent.insertBefore(child, before);
            });

            return this;
        },

        /**
         * Adds elements after element.
         *
         * @method addAfter
         * @param {string} selector
         * @param {string|NodeList|element} value
         * @return {string}
         */
        addAfter(selector, value) {

            let parent = CACHE.get(this)[0];
            if (!parent) {
                return this
            }

            let after = parent.querySelector(selector);
            if (!after) {
                return this
            }

            let children = convertAddValue(value);

            children.forEach((child) => {
                insertAfter(child, after);
                after = child;
            });

            return this;
        },

        /**
         * Adds elements as first children.
         *
         * @method addFirst
         * @param {string|NodeList|element} value
         * @return {string}
         */
        addFirst(value) {

            let parent = CACHE.get(this)[0];
            if (!parent) {
                return this
            }

            let before = parent.querySelector("*:first-child");

            let children = convertAddValue(value);

            children.forEach((child) => {
                if (before) {
                    parent.insertBefore(child, before);
                } else {
                    parent.appendChild(child);
                }
            });

            return this;
        },

        /**
         * Creates element.
         *
         * @method create
         * @param {string|object|null} [options]
         * @return {string}
         * @example create.example.js
         */
        create(options) {

            if (isString(options)) {
                options = {html: options}
            }
            if (!isObject(options)) {
                options = {}
            }

            let element = extractAttributes(this);

            if (element["id"]) {
                options["id"] = element["id"]
            }
            if (element["class"]) {
                options["class"] = element["class"]
            }

            element = document.createElement(element["nodeName"] || "div");

            for (let option in options) {
                if (options.hasOwnProperty(option)) {
                    if (option === "html") {
                        element.innerHTML = options[option]
                    } else if (option === "text") {
                        element.innerText = options[option]
                    } else {
                        element.setAttribute(option, options[option])
                    }
                }
            }

            let key = "create" + (currentId++);

            elementsStorage[key] = [element];

            return key;
        },

        /**
         * Clone all the elements in selection.
         *
         * @method clone
         * @param {boolean} [deep] True (default) to clone all attributes
         * @return {string} Returns the alias if all is done successfully.
         */
        clone(deep = true) {

            if (deep !== true) {
                deep = false
            }

            let clones = [], elements = CACHE.get(this);

            elements.forEach((element) => {
                clones.push(element.cloneNode(deep))
            });

            let key = "clone" + (currentId++);
            elementsStorage[key] = clones;

            return key;
        },

        /**
         * Give focus to an element.
         *
         * @method focus
         * @return {string}
         */
        focus() {

            let first = CACHE.get(this)[0];

            if (first) {
                first.focus();
            }

            return this;
        },

        /**
         * Checks if style property exists.
         *
         * @method hasStyle
         * @param {string} property
         * @return {boolean}
         */
        hasStyle(property) {

            let first = CACHE.get(this)[0];

            return !!(first && first.style[property]);
        },

        /**
         * Adds style property.
         *
         * @method getStyle
         * @param {string} property
         * @return {string}
         */
        getStyle(property) {

            let first = CACHE.get(this)[0];

            return first ? (first.style[property] || "") : "";
        },

        /**
         * Adds style property.
         *
         * @method addStyle
         * @param {string} property
         * @param {string} value
         * @return {string}
         */
        addStyle(property, value) {

            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.style[property] = value;
            });

            return this;
        },

        /**
         * Removes style property.
         *
         * @method removeStyle
         * @param {string} property
         * @return {string}
         */
        removeStyle(property) {

            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.style[property] = null;
            });

            return this;
        },

        /**
         * Gets computed style.
         *
         * @method getCss
         * @param {string} property
         * @return {string|object}
         */
        getCss(property) {

            let first = CACHE.get(this)[0];
            if (!first) {
                return this
            }

            return getComputedStyle(first, property)
        },

        /**
         * Checks if class exists.
         *
         * @method hasClass
         * @param {string} name
         * @return {boolean}
         */
        hasClass(name) {

            let first = CACHE.get(this)[0];

            return first && first.classList.contains(name) || false;
        },

        /**
         * Gets class.
         *
         * @method getClass
         * @return {string}
         */
        getClass() {

            let first = CACHE.get(this)[0];

            return first ? (first.getAttribute("class") || "") : "";
        },

        /**
         * Removes class.
         *
         * @method removeClass
         * @param {string} name
         * @return {string}
         */
        removeClass(name) {

            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.classList.remove(name);
            });

            return this;
        },

        /**
         * Adds class.
         *
         * @method addClass
         * @param {string} name
         * @return {string}
         */
        addClass(name) {

            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.classList.add(name);
            });

            return this;
        },

        /**
         * Toggles class.
         *
         * @method toggleClass
         * @param {string} name
         * @return {string}
         */
        toggleClass(name) {

            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.classList.toggle(name);
            });

            return this;
        },

        /**
         * Gets attribute value.
         *
         * @method getAttr
         * @param {string} name
         * @return {string}
         */
        getAttr(name) {

            let first = CACHE.get(this)[0];

            return (first && first.hasAttribute(name)) ? first.getAttribute(name) : "";
        },

        /**
         * Sets attribute value.
         *
         * @method setAttr
         * @param {string} name
         * @param {string} value
         * @return {string}
         */
        setAttr(name, value) {

            let elements = CACHE.get(this);

            elements.forEach((element) => {
                if (BOOLEAN_ATTRIBUTES.hasOwnProperty(name)) {
                    element[name] = true;
                } else {
                    element.setAttribute(name, value);
                }
            });

            return this;
        },

        /**
         * Adds attribute value.
         *
         * @method AddAttr
         * @param {string} name
         * @param {string} value
         * @return {string}
         */
        addAttr(name, value) {

            let elements = CACHE.get(this);

            elements.forEach((element) => {
                if (BOOLEAN_ATTRIBUTES.hasOwnProperty(name)) {
                    element[name] = true;
                } else {

                    if (element.hasAttribute(name)) {
                        value = (element.getAttribute(name) + " " + value).trim();
                    }
                    element.setAttribute(name, value);
                }
            });

            return this;
        },

        /**
         * Remove attribute.
         *
         * @method removeAttr
         * @param {string} name
         * @return {string}
         */
        removeAttr(name) {

            let elements = CACHE.get(this);

            elements.forEach((element) => {
                if (BOOLEAN_ATTRIBUTES.hasOwnProperty(name)) {
                    element[name] = false;
                } else {
                    element.removeAttribute(name);
                }
            });

            return this;
        },

        /**
         * Checks if an attribute exists.
         *
         * @method hasAttr
         * @param {string} name
         * @return {boolean}
         */
        hasAttr(name) {

            let first = CACHE.get(this)[0];

            return first && first.hasAttribute(name) || false;
        },

        /**
         * Checks if element is checked.
         *
         * @method isChecked
         * @return {boolean}
         */
        isChecked() {

            let first = CACHE.get(this)[0];

            return !!(first && first.checked);
        },

        /**
         * Checks if element is selected.
         *
         * @method isSelected
         * @return {boolean}
         */
        isSelected() {

            let first = CACHE.get(this)[0];

            return !!(first && first.selected);
        },

        /**
         * Checks if element is hidden.
         *
         * @method isHidden
         * @return {boolean}
         */
        isHidden() {

            let first = CACHE.get(this)[0],
                display = window.getComputedStyle(first, null).getPropertyValue("display");

            return display.toLowerCase() === "none";
        },

        /**
         * Hides elements.
         *
         * @method hide
         * @return {string}
         */
        hide() {
            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.style.display = 'none';
            });

            return this;
        },

        /**
         * Shows elements as block.
         *
         * @method showBlock
         * @return {string}
         */
        showBlock() {
            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.style.display = 'block';
            });

            return this;
        },

        /**
         * Shows elements as block.
         *
         * @method show
         * @return {string}
         */
        show() {
            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.style.display = 'block';
            });

            return this;
        },

        /**
         * Shows elements as inline.
         *
         * @method showInline
         * @return {string}
         */
        showInline() {
            let elements = CACHE.get(this);

            elements.forEach((element) => {
                element.style.display = 'inline';
            });

            return this;
        },

        /**
         * Loops elements.
         *
         * @method each
         * @param {function} callback
         * @return {string}
         * @example each.example.js
         */
        each(callback) {

            if (!isCallback(callback)) {
                return this;
            }

            let elements = CACHE.get(this);

            elements.forEach((value, key) => {
                callback.apply(this, [value, key])
            });

            return this;
        },

        /**
         * Gets path of an element.
         *
         * @method path
         * @return {string}
         */
        path() {

            let first = CACHE.get(this)[0], path = [];

            if (first) {
                while ((first = first.parentNode) && (first.nodeName.toLowerCase() !== "html")) {
                    path.push(first)
                }
            }

            let key = "path" + (currentId++);
            elementsStorage[key] = path;

            return key;
        },
    };

    Object.keys(METHODS).map((name) => {
        String.prototype[name] = METHODS[name];
    });

    Element.prototype["get"] = function () {

        let key = "getFromElement" + (currentId++);
        elementsStorage[key] = [this];

        return key;
    };
    NodeList.prototype["get"] = function () {

        let key = "getFromNodeList" + (currentId++);
        elementsStorage[key] = [].slice.call(this);

        return key;
    };

})(window);
