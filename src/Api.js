import Helper from './Helper.js';

export default class Api {

    constructor() {
        this.options = {
            method: 'GET',
            headers: new Headers(),
            // mode: 'cors',
            cache: 'default'
        };
        this.options.headers.append("Accept", "application/json");
        this.options.headers.append("X-Requested-With", "XMLHttpRequest");
    }

    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            this.options.method = 'GET';
            delete this.options.body;

            let esc = encodeURIComponent;
            let query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');

            fetch(url += '?' + query, this.options)
                .then((response) => {
                    response.json()
                        .then((data) => {
                            return (response.ok && !data.error) ? resolve(data) : reject(data);
                        })
                        .catch((error)=>{
                            return reject(error)
                        });
                })
                .catch((response) => {
                    response.json()
                        .then((data) => {
                            return reject(data)
                        })
                        .catch((error)=>{
                            return reject(error)
                        });
                })
        });
    }

    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            this.options.method = 'POST';
            let formData = null;
            if(Helper.isFormData(params)){
                formData = params;
            }else {
                formData = new FormData();
                Object.keys(params).map((key) => {
                    formData.append(key, params[key]);
                });
            }
            this.options.body = formData;

            fetch(url, this.options)
                .then((response) => {
                    response.json()
                        .then((data) => {
                            return (response.ok && !data.error) ? resolve(data) : reject(data);
                        })
                        .catch((error)=>{
                            return reject(error)
                        });
                })
                .catch((response) => {
                    response.json()
                        .then((data) => {
                            return reject(data)
                        })
                        .catch((error)=>{
                            return reject(error)
                        });
                });
        });
    }

}