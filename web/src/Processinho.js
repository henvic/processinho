'use strict';

import ComponentRegistry from 'bower:metal/src/component/ComponentRegistry';
import SoyComponent from 'bower:metal/src/soy/SoyComponent';
import './Processinho.soy';

class Processinho extends SoyComponent {
    constructor (opt_config) {
        super(opt_config);
    }
}

Processinho.ELEMENT_CLASSES = 'processinho';

ComponentRegistry.register('Processinho', Processinho);

export default Processinho;
