import { isValidCSSIdentifier } from './utilities'
/**
 * @typedef  {Object} Pattern
 * @property {('descendant' | 'child')}                  [relates]
 * @property {string}                                    [tag]
 * @property {Array.<{ name: string, value: string? }>}  attributes
 * @property {Array.<string>}                            classes
 * @property {Array.<string>}                            pseudo
 * @property {Array.<Array.<Pattern>>}                   descendants
 */

/**
 * Creates a new pattern structure
 * 
 * @param {Partial<Pattern>} pattern
 * @returns {Pattern}
 */
export const createPattern = (base = {}) =>
  ({ attributes: [], classes: [], pseudo: [], descendants: [], ...base })

/**
 * Convert attributes to CSS selector
 * 
 * @param {Array.<{ name: string, value: string? }>} attributes 
 * @returns {string}
 */
export const attributesToSelector = (attributes) =>
  attributes.map(({ name, value }) => {
    if (value === null) {
      return `[${name}]`
    }
    if (name === 'id' && isValidCSSIdentifier(value)) {
      return `#${value}`
    }
    return `[${name}="${value}"]`
  }).join('')

/**
 * Convert classes to CSS selector
 * 
 * @param {Array.<string>} classes 
 * @returns {string}
 */
export const classesToSelector = (classes) =>
  classes.map(c => isValidCSSIdentifier(c) ? `.${c}` : `[class~="${c}"]`).join('')

/**
 * Convert pseudo selectors to CSS selector
 * 
 * @param {Array.<string>} pseudo 
 * @returns {string}
 */
export const pseudoToSelector = (pseudo) => pseudo.length ? `:${pseudo.join(':')}` : ''

/**
 * Convert pattern to CSS selector
 * 
 * @param {Pattern} pattern 
 * @returns {string}
 */
export const patternToSelector = (pattern) => {
  const { relates, tag, attributes, classes, pseudo } = pattern
  const value = `${
    relates === 'child' ? '> ' : ''
  }${
    tag || ''
  }${
    attributesToSelector(attributes)
  }${
    classesToSelector(classes)
  }${
    pseudoToSelector(pseudo)
  }`
  return value
}

/**
 * Converts path to string
 *
 * @param {Array.<Pattern>} path 
 * @returns {string}
 */
export const pathToSelector = (path) =>
  path.map(patternToSelector).join(' ')


const convertEscaping = (value) =>
  value && value.replace(/\\([`\\/:?&!#$%^()[\]{|}*+;,.<=>@~])/g, '$1')
    .replace(/\\(['"])/g, '$1$1')
    .replace(/\\A /g, '\n')

/**
* Convert attributes to XPath string
* 
* @param {Array.<{ name: string, value: string? }>} attributes 
* @returns {string}
*/
export const attributesToXPath = (attributes) =>
  attributes.map(({ name, value }) => {
    if (value === null) {
      return `[@${name}]`
    }
    return `[@${name}="${convertEscaping(value)}"]`
  }).join('')

/**
* Convert classes to XPath string
* 
* @param {Array.<string>} classes 
* @returns {string}
*/
export const classesToXPath = (classes) =>
  classes.map(c => `[contains(concat(" ",normalize-space(@class)," ")," ${c} ")]`).join('')

/**
* Convert pseudo selectors to XPath string
* 
* @param {Array.<string>} pseudo 
* @returns {string}
*/
export const pseudoToXPath = (pseudo) =>
  pseudo.map(p => {
    const match = p.match(/^(nth-child|nth-of-type|contains)\((.+)\)$/)
    if (!match) {
      return ''
    }

    switch (match[1]) {
      case 'nth-child':
        return `[(count(preceding-sibling::*)+1) = ${match[2]}]`

      case 'nth-of-type':
        return `[${match[2]}]`

      case 'contains':
        return `[contains(text(),${match[2]})]`

      default:
        return ''
    }
  }).join('')

/**
* Convert pattern to XPath string
* 
* @param {Pattern} pattern 
* @returns {string}
*/
export const patternToXPath = (pattern) => {
  const { relates, tag, attributes, classes, pseudo, descendants } = pattern
  const value = `${
    relates === 'child' ? '/' : '//'
  }${
    tag || '*'
  }${
    attributesToXPath(attributes)
  }${
    classesToXPath(classes)
  }${
    pseudoToXPath(pseudo)
  }${
    descendantsToXPath(descendants)
  }`
  return value
}

/**
* Converts path to XPath string
*
* @param {Array.<Pattern>} path 
* @returns {string}
*/
export const pathToXPath = (path) => `.${path.map(patternToXPath).join('')}`

/**
* Convert child selectors to XPath string
* 
* @param {Array.<Array.<Pattern>>} children 
* @returns {string}
*/
export const descendantsToXPath = (children) =>
  children.length ? `[${children.map(pathToXPath).join('][')}]` : ''

  
const toString = {
  'css': {
    attributes: attributesToSelector,
    classes: classesToSelector,
    pseudo: pseudoToSelector,
    pattern: patternToSelector,
    path: pathToSelector
  },
  'xpath': {
    attributes: attributesToXPath,
    classes: classesToXPath,
    pseudo: pseudoToXPath,
    pattern: patternToXPath,
    path: pathToXPath
  },
  'jquery': {}
}

toString.jquery = toString.css
toString[0] = toString.css
toString[1] = toString.xpath
  
/**
 * @typedef  {Object} ToStringApi
 * @property {(attributes: Array.<{ name: string, value: string? }>) => string} attributes
 * @property {(classes: Array.<string>) => string}  classes
 * @property {(pseudo: Array.<string>) => string}   pseudo
 * @property {(pattern: Pattern) => string}         pattern
 * @property {(path: Array.<Pattern>) => string}    path
 */

/**
 * 
 * @param {Options} options 
 * @returns {ToStringApi}
 */
export const getToString = (options = {}) =>
  toString[options.format || 'css']


