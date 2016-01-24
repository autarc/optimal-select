/**
 * # Select
 *
 * Construct a unique CSS queryselector to access the selected DOM element(s).
 * Applies different matching and optimization strategies for efficiency.
 */

import match from './match'
import optimize from './optimize'

const defaultOptions = {
  excludes: {
    'style': '.*',
    'data-reactid': '.*',
    'data-react-checksum': '.*'
  }
}

/**
 * Choose action depending on the input (single/multi)
 * @param  {HTMLElement|Array} input   - [description]
 * @param  {Object}            options - [description]
 * @return {String}                    - [description]
 */
export default function getQuerySelector (input, options = {}) {
  options = { ...defaultOptions, ...options }
  Object.keys(options.excludes).forEach((attribute) => {
    var patterns = options.excludes[attribute]
    if (!Array.isArray(patterns)) {
      patterns = [patterns]
    }
    options.excludes[attribute] = patterns.map((pattern) => new RegExp(pattern))
  })
  if (Array.isArray(input)) {
    return getMultiSelector(input, options)
  }
  return getSingleSelector(input, options)
}

/**
 * Get a selector for the provided element
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      options - [description]
 * @return {String}              - [description]
 */
export function getSingleSelector (element, options) {

  if (element.nodeType === 3) {
    return getQuerySelector(element.parentNode)
  }
  if (element.nodeType !== 1) {
    throw new Error('Invalid input!')
  }

  const selector = match(element, options)
  const optimized = optimize(selector, element)

  // debug
  // console.log(`
  //   selector: ${selector}
  //   optimized:${optimized}
  // `);

  return optimized
}

/**
 * Get a selector to match multiple children from a parent
 * @param  {Array}  elements - [description]
 * @param  {Object} options  - [description]
 * @return {String}          - [description]
 */
export function getMultiSelector (elements, options) {
  var commonParentNode = null
  var commonClassName = null
  var commonAttribute = null
  var commonTagName = null

  for (var i = 0, l = elements.length; i < l; i++) {
    var element = elements[i]
    if (!commonParentNode) { // 1st entry
      commonParentNode = element.parentNode
      commonClassName = element.className
      // commonAttribute = element.attributes
      commonTagName = element.tagName
    } else if (commonParentNode !== element.parentNode) {
      return console.log('Can\'t be efficiently mapped. It probably best to use multiple single selectors instead!')
    }
    if (element.className !== commonClassName) {
      var classNames = []
      var longer, shorter
      if (element.className.length > commonClassName.length) {
        longer = element.className
        shorter = commonClassName
      } else {
        longer = commonClassName
        shorter = element.className
      }
      shorter.split(' ').forEach((name) => {
        if (longer.indexOf(name) > -1) {
          classNames.push(name)
        }
      })
      commonClassName = classNames.join(' ')
    }
    // TODO:
    // - check attributes
    // if (element.attributes !== commonAttribute) {
    //
    // }
    if (element.tagName !== commonTagName) {
      commonTagName = null
    }
  }

  const selector = getSingleSelector(commonParentNode)
  console.log(selector, commonClassName, commonAttribute, commonTagName)

  if (commonClassName) {
    return `${selector} > .${commonClassName.replace(/ /g, '.')}`
  }
  // if (commonAttribute) {
  //
  // }
  if (commonTagName) {
    return `${selector} > ${commonTagName.toLowerCase()}`
  }
  return `${selector} > *`
}
