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
    }

    detached () {
        super.detached();
        this.eventHandler.removeAllListeners();
        this.lastSearch = undefined;
    }

    search (event) {
        this.lastSearch = fetch('/search?q=' + encodeURIComponent(event.target.value));

        this.lastSearch.then((response) => {
            if (!response.ok) {
                console.error('Failure in retrieving object.');
                return;
            }

            response.json().then((content) => {
                this.results = content;
            });
        })
        .catch(function (error) {
            console.error('There has been a problem with your fetch operation: ' + error.message);
        });
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
    }
};

ComponentRegistry.register('Processinho', Processinho);

export default Processinho;
