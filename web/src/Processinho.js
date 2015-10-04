'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import SoyComponent from 'bower:metal/src/soy/SoyComponent';
import ComponentRegistry from 'bower:metal/src/component/ComponentRegistry';
import EventHandler from 'bower:metal/src/events/EventHandler';
import 'bower:metal/src/dom/events';
import './Processinho.soy.js';

class Processinho extends SoyComponent {
    constructor (opt_config) {
        super(opt_config);
        this.eventHandler = new EventHandler();
        this.bindHotKeys();

        this.loadFirstTime();
    }

    detached () {
        super.detached();
        this.eventHandler.removeAllListeners();
        this.lastSearch = undefined;
    }

    bindHotKeys () {
        this.eventHandler.add(dom.on(document, 'keyup', this.handleHotKey.bind(this)));
    }

    handleHotKey (event) {
        if (event.keyCode !== 191 || event.target.nodeName !== 'BODY') {
            return;
        }

        this.element.querySelector('[name="q"]').focus();
    }

    syncQ () {
        this.search();
    }

    searchKeyup (event) {
        let value = event.target.value;

        if (value === '') {
            this.results = {};
            this.pagination = [];
            return;
        }

        // enter = 13
        if (event.keyCode === 13) {
            this.q = event.target.value;
            this.search();
        }
    }

    search () {
        var template = this;
        let xhr;

        console.log(template);

        if (this.lastSearch) {
            this.lastSearch.abort();
        }

        xhr = new XMLHttpRequest();

        this.lastSearch = xhr;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let res = JSON.parse(xhr.responseText);
                let address;

                template.results = res;

                if (template.page > 1) {
                    template.results.previous = '/?q=' + encodeURIComponent(template.q).replace(/%20/g, "+") + '&page=' + (template.page - 1);
                }

                if (Math.ceil(res.hits.total / template.perPage) > template.page) {
                    template.results.next = '/?q=' + encodeURIComponent(template.q).replace(/%20/g, "+") + '&page=' + (parseInt(template.page) + 1);
                }

                address = '/?q=' + encodeURIComponent(template.q).replace(/%20/g, "+");

                if (template.page !== 1) {
                    address += '&page=' + template.page;
                }

                window.history.pushState(null, null, address);

                template.results.hits.hits.forEach((res) => {
                    if (!res || !res.highlight || !res.highlight.texto_puro) {
                        return;
                    }

                    res.highlight.texto_puro.forEach((highlight, index) => {
                        res.highlight.texto_puro[index] = soydata.VERY_UNSAFE.ordainSanitizedHtml(highlight);
                    });
                });

                return;
            }
        };

        xhr.onerror = function (error) {
            console.error('There has been a problem with your fetch operation: ' + error.message);
        };

        xhr.open('GET', '/search?q=' + encodeURIComponent(template.q) + '*&from=' + (this.perPage * (this.page - 1)) + '&size=' + this.perPage);
        xhr.send();
    }

    loadFirstTime () {
        let params = this.parseLocationQueryString(window.location.search);

        if (!params.q) {
            return;
        }

        this.page = params.page || 1;

        this.q = decodeURI(params.q);
    }

    parseQueryString (queryString) {
            //from http://www.joezimjs.com/javascript/3-ways-to-parse-a-query-string-in-a-url/
            let params = {};
            let queries;
            let temp;
            let i;
            let l;

            queryString = queryString.replace(/\+/g, ' ');

            // Split into key/value pairs
            queries = queryString.split('&');

            if (queries.length === 1 && queries[0] === '') {
                queries = ['q='];
            }

            // Convert the array of strings into an object
            for (i = 0, l = queries.length; i < l; i = i + 1) {
                temp = queries[i].split('=');
                params[temp[0]] = temp[1];
            }

            if (params.q === undefined) {
                params.q = '';
            }

            return params;
        }

        parseLocationQueryString () {
            return this.parseQueryString(window.location.search.substr(1));
        }
}

Processinho.ELEMENT_CLASSES = 'Processinho';

Processinho.ATTRS = {
    animClasses: {
        validator: core.isObject,
        value: {
            show: 'fade in',
            hide: 'fade'
        }
    },
    q: {
        value: ''
    },
    page: {
        value: 1
    },
    perPage: {
        value: 10
    }
};

ComponentRegistry.register('Processinho', Processinho);

export default Processinho;
