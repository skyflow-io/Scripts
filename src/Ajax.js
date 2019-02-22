import Helper from './Helper';

/**
 * Skyflow Ajax - Use ajax as an object to exchange data between the client and the server.
 *
 * @class Ajax
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @example
 *      let ajax = new Ajax();
 *      ajax.send('my-url', (stateObject)=>{
 *          console.log(stateObject);
 *      }, (stateObject)=>{
 *          console.log(stateObject);
 *      });
 */
export default class Ajax {

    constructor() {

        /**
         * Current XMLHttpRequest object.
         *
         * @private
         * @property xhr
         * @type XMLHttpRequest
         * @default null
         * @since 1.0.0
         */
        this.xhr = null;

        if (window.XMLHttpRequest || window.ActiveXObject) {
            if (window.ActiveXObject) {
                try {
                    this.xhr = new ActiveXObject('Msxml2.XMLHTTP');
                } catch (e) {
                    this.xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }
            } else {
                this.xhr = new XMLHttpRequest();
            }
        }

        /**
         * Query method. Use 'get' or 'post' value.
         *
         * @property method
         * @type String
         * @default 'get'
         * @since 1.0.0
         */
        this.method = 'get';

        /**
         * Data to be transmitted to the server.
         *
         * @property data
         * @type Object
         * @default {}
         * @since 1.0.0
         */
        this.data = {};

        /**
         * Request headers.
         *
         * @property headers
         * @type Object
         * @default
         *      {
         *          'X-Requested-With': 'XMLHttpRequest'
         *      }
         * @since 1.0.0
         * @example
         *      const ajax = new Ajax();
         *      ajax.headers['Accept-Charset'] = 'utf-8';
         */
        this.headers = {
            'X-Requested-With': 'XMLHttpRequest',
        };

        /**
         * Request url.
         *
         * @property url
         * @type Object
         * @default null
         * @since 1.0.0
         */
        this.url = null;

        /**
         * Callback to trigger for each state of the request.
         *
         * @property state
         * @type Object
         * @default {}
         * @since 1.0.0
         * @example
         *      const ajax = new Ajax();
         *      ajax.state[3] = (stateObject)=>{
         *          console.log(stateObject);
         *      };
         * @link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
         */
        this.state = {};

        /**
         * Callback to trigger for each status of the request.
         *
         * @property status
         * @type Object
         * @default {}
         * @since 1.0.0
         * @example
         *      const ajax = new Ajax();
         *      ajax.state[0] = (stateObject)=>{
         *          console.log(stateObject);
         *      };
         * @link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status
         */
        this.status = {};

        /**
         * Callback to trigger for a success request.
         *
         * @property success
         * @type Function
         * @default null
         * @since 1.0.0
         * @example
         *      const ajax = new Ajax();
         *      ajax.success = (stateObject)=>{
         *          console.log(stateObject);
         *      };
         */
        this.success = null;

        /**
         * Callback to trigger for a failed request.
         *
         * @property error
         * @type Function
         * @default null
         * @since 1.0.0
         * @example
         *      const ajax = new Ajax();
         *      ajax.error = (stateObject)=>{
         *          console.log(stateObject);
         *      };
         */
        this.error = null;

        /**
         * This property stores the last request object.
         *
         * @property lastRequest
         * @type Object
         * @default null
         * @since 1.0.0
         * @readOnly
         */
        this.lastRequest = null;

        this.xhrMethodsHandler = {

            get: () => {
                let data = '';
                let keys = Object.keys(this.data);
                keys.map((key) => {
                    data += `&${key}=${encodeURIComponent(this.data[key])}`;
                    return key;
                });

                data = data.slice(1);

                this.xhr.open('GET', `${this.url}?${data}`, true);

                keys = Object.keys(this.headers);
                keys.map((key) => {
                    this.xhr.setRequestHeader(key, this.headers[key]);
                    return key;
                });

                this.xhr.send(null);
            },

            post: () => {
                let data = '';

                if(!Helper.isFormData(this.data)){
                    let keys = Object.keys(this.data);
                    keys.map((key) => {
                        data += `&${key}=${this.data[key]}`;
                        return key;
                    });

                    data = data.slice(1);
                }

                this.xhr.open('POST', this.url, true);

                let keys = Object.keys(this.headers);
                keys.map((key) => {
                    this.xhr.setRequestHeader(key, this.headers[key]);
                    return key;
                });

                if(!this.headers.hasOwnProperty('Content-type')){
                    this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }

                this.xhr.send(data);
            },

        };
    }

    /**
     * Send request.
     *
     * @method send
     * @param {String} [url] Request url.
     * @param {Function} [successCallback] Callback to trigger for a success request.
     * @param {Function} [errorCallback] Callback to trigger for a failed request.
     * @since 1.0.0
     * @returns {Ajax} Returns the current Ajax object.
     */
    send(url, successCallback, errorCallback) {
        if (!this.xhr || !Helper.isString(url)) {
            return this;
        }

        this.url = url;

        if (Helper.isCallback(successCallback)) {
            this.success = successCallback;
        }

        if (Helper.isCallback(errorCallback)) {
            this.error = errorCallback;
        }

        this.xhrMethodsHandler[(this.method + '').toLowerCase()]();

        this.xhr.onreadystatechange = () => {
            const callbackObject = {
                method: this.method,
                data: this.data,
                url: this.url,
                textResponse: this.xhr.responseText || null,
                xmlResponse: this.xhr.responseXML || null,
                state: this.xhr.readyState,
                status: this.xhr.status,
            };

            try {
                callbackObject.jsonResponse = JSON.parse(this.xhr.responseText);
            } catch (e) {
                callbackObject.jsonResponse = null;
            }

            const headers = {};
            const responseHeaders = this.xhr.getAllResponseHeaders().split(/[\n\r]/);

            responseHeaders.forEach((responseHeader) => {
                responseHeader.replace(/([^:]+): ?(.+)/, (str, s1, s2) => {
                    headers[s1] = s2;
                });
            });

            headers.date = new Date(headers.date);

            callbackObject.headers = headers;

            const status = this.status[this.xhr.status];
            if (Helper.isCallback(status)) {
                status.apply(this, [callbackObject, callbackObject.jsonResponse, callbackObject.textResponse]);
            }

            const state = this.state[this.xhr.readyState];
            if (Helper.isCallback(state)) {
                state.apply(this, [callbackObject, callbackObject.jsonResponse, callbackObject.textResponse]);
            }

            if (this.xhr.readyState === 4) {
                if (this.xhr.status === 200 || this.xhr.status === 0) {
                    if (Helper.isCallback(this.success)) {
                        this.success.apply(this, [callbackObject, callbackObject.jsonResponse, callbackObject.textResponse]);
                    }
                } else if (Helper.isCallback(this.error)) {
                    this.error.apply(this, [callbackObject, callbackObject.status]);
                }
            }

            this.lastRequest = callbackObject;
        };

        return this;
    }
}
