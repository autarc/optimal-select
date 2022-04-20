// import Sizzle from 'sizzle'
let Sizzle

/**
 * Select element using jQuery
 * @param  {string}         selector
 * @param  {HTMLElement}    parent
 * @return Array.<HTMLElement>
 */
const selectJQuery = (selector, parent = null) => {
  if (!Sizzle) {
    Sizzle = require('sizzle')
  }
  return Sizzle(selector, parent || document)
}
  
/**
 * Select element using XPath
 * @param  {string}         selector
 * @param  {HTMLElement}    parent
 * @return Array.<HTMLElement>
 */
const selectXPath = (selector, parent = null) => {
  parent = (parent || document)
  var doc = parent
  while (doc.parentNode) {
    doc = doc.parentNode
  }
  if (doc !== parent && !selector.startsWith('.')) {
    selector = `.${selector}`
  }
  var iterator = doc.evaluate(selector, parent, null, 0)
  var elements = []
  var element
  while ((element = iterator.iterateNext())) {
    elements.push(element)
  }
  return elements
}
  
/**
 * Select element using CSS
 * @param  {string}         selector
 * @param  {HTMLElement}    parent
 * @return Array.<HTMLElement>
 */
const selectCSS = (selector, parent = null) =>
  (parent || document).querySelectorAll(selector)

const select = {
  'css': selectCSS,
  'xpath': selectXPath,
  'jquery': selectJQuery
}

select[0] = select.css
select[1] = select.xpath

/**
* 
* @param {Options} options 
* @returns {(selector: string, parent: HTMLElement) => Array.<HTMLElement>}
*/
export const getSelect = (options = {}) =>
  (selector, parent) => {
    try {
      return select[options.format || 'css'](selector, parent || options.root)
    } catch (err) {
      return []
    }
  }

