/* jshint ignore:start */
import ComponentRegistry from 'bower:metal/src/component/ComponentRegistry';
var Templates = ComponentRegistry.Templates;
// This file was automatically generated from Processinho.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Templates.Processinho.
 */

if (typeof Templates.Processinho == 'undefined') { Templates.Processinho = {}; }


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object.<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
Templates.Processinho.content = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div id="' + soy.$$escapeHtmlAttribute(opt_data.id) + '" class="processinho component' + soy.$$escapeHtmlAttribute(opt_data.elementClasses ? ' ' + opt_data.elementClasses : '') + '"></div>');
};
if (goog.DEBUG) {
  Templates.Processinho.content.soyTemplateName = 'Templates.Processinho.content';
}

Templates.Processinho.content.params = ["id"];
export default Templates.Processinho;
/* jshint ignore:end */
