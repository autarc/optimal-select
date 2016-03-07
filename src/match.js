/**
 * # Match
 *
 * Retrieves selector
 */

/**
 * Get the path of the element
 * @param  {HTMLElement} node    - [description]
 * @param  {Object}      options - [description]
 * @return {String}              - [description]
 */
export default function match (node, options) {
  const path = []
  var element = node
  var length = path.length

  while (element !== document) {
    // global
    if (checkId(element, path, options)) break
    if (checkClassGlobal(element, path, options)) break
    if (checkAttributeGlobal(element, path, options)) break
    if (checkTagGlobal(element, path)) break

    // local
    checkClassLocal(element, path, options)

    // define only one selector each iteration
    if (path.length === length) {
      checkAttributeLocal(element, path, options)
    }
    if (path.length === length) {
      checkTagLocal(element, path)
    }

    if (path.length === length) {
      checkClassChild(element, path, options)
    }
    if (path.length === length) {
      checkAttributeChild(element, path, options)
    }
    if (path.length === length) {
      checkTagChild(element, path)
    }

    element = element.parentNode
    length = path.length
  }

  if (element === document) {
    path.unshift('*')
  }

  return path.join(' ')
}


/**
 * [checkClassGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassGlobal (element, path, options) {
  return checkClass(element, path, document, options)
}

/**
 * [checkClassLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassLocal (element, path, options) {
  return checkClass(element, path, element.parentNode, options)
}

/**
 * [checkClassChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassChild (element, path, options) {
  const className = element.getAttribute('class')
  if (!className || compareExcludes(className, options.excludes.class)) {
    return false
  }
  return checkChild(element, path, `.${className.replace(/ /g, '.')}`)
}

/**
 * [checkAttributeGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      options - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeGlobal (element, path, options) {
  return checkAttribute(element, path, document, options)
}

/**
 * [checkAttributeLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      options - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeLocal (element, path, options) {
  return checkAttribute(element, path, element.parentNode, options)
}

/**
 * [checkAttributeChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      options - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeChild (element, path, options) {
  const attributes = element.attributes
  return Object.keys(attributes).some((key) => {
    const attribute = attributes[key]
    const attributeName = attribute.name
    const  attributeValue = attribute.value
    // include 'id', 'class' check ?
    // if (['id', 'class'].concat(options.excludes).indexOf(attributeName) > -1) {
    //   return false
    // }
    if (compareExcludes(attributeValue, options.excludes[attributeName])) {
      return false
    }
    const pattern = `[${attributeName}="${attributeValue}"]`
    return checkChild(element, path, pattern, options)
  })
}

/**
 * [checkTagGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkTagGlobal (element, path) {
  return checkTag(element, path, document)
}

/**
 * [checkTagLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkTagLocal (element, path) {
  return checkTag(element, path, element.parentNode)
}

/**
 * [checkTabChildren description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkTagChild (element, path) {
  return checkChild(element, path, element.tagName.toLowerCase())
}

/**
 * [checkId description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkId (element, path) {
  const id = element.id
  if (!id) {
    return false
  }
  path.unshift(`#${id}`)
  return true
}

/**
 * [checkClass description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {HTMLElement} parent  - [description]
 * @return {Boolean}             - [description]
 */
function checkClass (element, path, parent, options) {
  const className = element.getAttribute('class')
  if (!className || compareExcludes(className, options.excludes.class)) {
    return false
  }
  const matches = parent.getElementsByClassName(className)
  if (matches.length === 1) {
    path.unshift(`.${className.replace(/ /g, '.')}`)
    return true
  }
  return false
}

/**
 * [checkAttribute description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {HTMLElement} parent  - [description]
 * @param  {Object}      options - [description]
 * @return {Boolean}             - [description]
 */
function checkAttribute (element, path, parent, options) {
  const attributes = element.attributes
  return Object.keys(attributes).some((key) => {
    const attribute = attributes[key]
    const attributeName = attribute.name
    const attributeValue = attribute.value
    if (compareExcludes(attributeValue, options.excludes[attributeName])) {
      return false
    }
    const pattern = `[${attributeName}="${attributeValue}"]`
    const matches = parent.querySelectorAll(pattern)
    if (matches.length === 1) {
      path.unshift(pattern)
      return true
    }
  })
}

/**
 * [checkTag description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {HTMLElement} parent  - [description]
 * @return {Boolean}             - [description]
 */
function checkTag (element, path, parent) {
  const tagName = element.tagName.toLowerCase()
  const matches = parent.getElementsByTagName(tagName)
  if (matches.length === 1) {
    path.unshift(tagName)
    return true
  }
  return false
}

/**
 * [checkChild description]
 * @param  {HTMLElement} element  - [description]
 * @param  {Array}       path     - [description]
 * @param  {String}      selector - [description]
 * @return {Boolean}              - [description]
 */
function checkChild (element, path, selector) {
  const parent = element.parentNode
  const children = parent.children
  for (var i = 0, l = children.length; i < l; i++) {
    if (children[i] === element) {
      path.unshift(`> ${selector}:nth-child(${i+1})`)
      return true
    }
  }
  return false
}

/**
 * [compareExcludes description]
 * @param  {String}            value    - [description]
 * @param  {Null|String|Array} excludes - [description]
 * @return {Boolean}                    - [description]
 */
function compareExcludes (value, excludes) {
  if (!excludes) {
    return false
  }
  return excludes.some((exclude) => exclude.test(value))
}
