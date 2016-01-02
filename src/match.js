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
    if (checkId(element, path)) break
    if (checkClassGlobal(element, path)) break
    if (checkAttributeGlobal(element, path, options)) break
    if (checkTagGlobal(element, path)) break

    // local
    checkClassLocal(element, path)

    // define only one selector each iteration
    if (path.length === length) {
      checkAttributeLocal(element, path, options)
    }
    if (path.length === length) {
      checkTagLocal(element, path)
    }

    if (path.length === length) {
      checkClassChild(element, path)
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
function checkClassGlobal (element, path) {
  return checkClass(element, path, document)
}

/**
 * [checkClassLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassLocal (element, path) {
  return checkClass(element, path, element.parentNode)
}

/**
 * [checkClassChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassChild (element, path) {
  var className = element.className
  if (!className) {
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
  var attributes = element.attributes
  return Object.keys(attributes).some((key) => {
    var attribute = attributes[key]
    var attributeName = attribute.name
    if (['id', 'class'].concat(options.excludes).indexOf(attributeName) > -1) {
      return false
    }
    var attributeValue = attribute.value
    var pattern = `[${attributeName}="${attributeValue}"]`
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
function checkClass (element, path, parent) {
  var className = element.className
  if (!className) {
    return false
  }
  var matches = parent.getElementsByClassName(className)
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
  var attributes = element.attributes
  return Object.keys(attributes).some((key) => {
    var attribute = attributes[key]
    var attributeName = attribute.name
    if (['id', 'class'].concat(options.excludes).indexOf(attributeName) > -1) {
      return false
    }
    var attributeValue = attribute.value
    var pattern = `[${attributeName}="${attributeValue}"]`
    var matches = parent.querySelectorAll(pattern)
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
  var tagName = element.tagName.toLowerCase()
  var matches = parent.getElementsByTagName(tagName)
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
  var parent = element.parentNode
  var children = parent.children
  for (var i = 0, l = children.length; i < l; i++) {
    if (children[i] === element) {
      path.unshift(`> ${selector}:nth-child(${i+1})`)
      return true
    }
  }
  return false
}
