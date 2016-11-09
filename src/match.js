/**
 * # Match
 *
 * Retrieves selector
 */

import { escapeValue } from './utilities'

const defaultIgnore = {
  attribute (attributeName) {
    return [
      'style',
      'data-reactid',
      'data-react-checksum'
    ].indexOf(attributeName) > -1
  }
}

/**
 * Get the path of the element
 *
 * @param  {HTMLElement} node    - [description]
 * @param  {Object}      options - [description]
 * @return {string}              - [description]
 */
export default function match (node, options) {

  const {
    root = document,
    skip = null,
    // TODO: refactor the detection to customize the execution order based on the attribute names
    priority = ['id', 'class', 'href', 'src'],
    ignore = {}
  } = options

  const path = []
  var element = node
  var length = path.length

  const skipCompare = skip && (Array.isArray(skip) ? skip : [skip]).map((entry) => {
    if (typeof entry !== 'function') {
      return (element) => element === entry
    }
    return entry
  })

  const skipChecks = (element) => {
    return skip && skipCompare.some((compare) => compare(element))
  }

  var ignoreClass = false

  Object.keys(ignore).forEach((type) => {
    if (type === 'class') {
      ignoreClass = true
    }
    var predicate = ignore[type]
    if (typeof predicate === 'function') return
    if (typeof predicate === 'number') {
      predicate = predicate.toString()
    }
    if (typeof predicate === 'string') {
      predicate = new RegExp(escapeValue(predicate).replace(/\\/g, '\\\\'))
    }
    // check class-/attributename for regex
    ignore[type] = predicate.test.bind(predicate)
  })

  if (ignoreClass) {
    const ignoreAttribute = ignore.attribute
    ignore.attribute = (name, value, defaultPredicate) => {
      return ignore.class(value) || ignoreAttribute && ignoreAttribute(name, value, defaultPredicate)
    }
  }

  while (element !== root) {

    if (skipChecks(element) !== true) {
      // global
      if (checkId(element, path, ignore)) break
      if (checkClassGlobal(element, path, ignore, root)) break
      if (checkAttributeGlobal(element, path, ignore, root, priority)) break
      if (checkTagGlobal(element, path, ignore, root)) break

      // local
      checkClassLocal(element, path, ignore)

      // define only one selector each iteration
      if (path.length === length) {
        checkAttributeLocal(element, path, ignore, priority)
      }
      if (path.length === length) {
        checkTagLocal(element, path, ignore)
      }

      if (path.length === length) {
        checkClassChild(element, path, ignore)
      }
      if (path.length === length) {
        checkAttributeChild(element, path, ignore, priority)
      }
      if (path.length === length) {
        checkTagChild(element, path, ignore)
      }
    }

    element = element.parentNode
    length = path.length
  }

  if (element === root) {
    path.unshift('*')
  }

  return path.join(' ')
}


/**
 * Preset 'checkClass' with global data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkClassGlobal (element, path, ignore, root) {
  return checkClass(element, path, ignore, root)
}

/**
 * Preset 'checkClass' with local data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkClassLocal (element, path, ignore) {
  return checkClass(element, path, ignore, element.parentNode)
}

/**
 * Preset 'checkChild' with class data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkClassChild (element, path, ignore) {
  const className = escapeValue(element.getAttribute('class'))
  if (checkIgnore(ignore.class, className)) {
    return false
  }
  return checkChild(element, path, `.${className.trim().replace(/\s+/g, '.')}`)
}

/**
 * Preset 'checkAttribute' with global data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkAttributeGlobal (element, path, ignore, root, priority) {
  return checkAttribute(element, path, ignore, root, priority)
}

/**
 * Preset 'checkAttribute' with local data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkAttributeLocal (element, path, ignore, priority) {
  return checkAttribute(element, path, ignore, element.parentNode, priority)
}

/**
 * Preset 'checkChild' with attribute data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkAttributeChild (element, path, ignore, priority) {
  const attributes = element.attributes
  return Object.keys(attributes).sort(orderByPriority(attributes, priority)).some((key) => {
    const attribute = attributes[key]
    const attributeName = attribute.name
    const attributeValue = escapeValue(attribute.value)
    if (checkIgnore(ignore.attribute, attributeName, attributeValue, defaultIgnore.attribute)) {
      return false
    }
    const pattern = `[${attributeName}="${attributeValue}"]`
    return checkChild(element, path, pattern)
  })
}

/**
 * Preset 'checkTag' with global data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkTagGlobal (element, path, ignore, root) {
  return checkTag(element, path, ignore, root)
}

/**
 * Preset 'checkTag' with local data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkTagLocal (element, path, ignore) {
  return checkTag(element, path, ignore, element.parentNode)
}

/**
 * Preset 'checkChild' with tag data
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkTagChild (element, path, ignore) {
  const tagName = element.tagName.toLowerCase()
  if (checkIgnore(ignore.tag, tagName)) {
    return false
  }
  return checkChild(element, path, tagName)
}

/**
 * Lookup unique identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkId (element, path, ignore) {
  const id = escapeValue(element.getAttribute('id'))
  if (checkIgnore(ignore.id, id)) {
    return false
  }
  path.unshift(`#${id}`)
  return true
}

/**
 * Lookup class identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
 */
function checkClass (element, path, ignore, parent) {
  const className = escapeValue(element.getAttribute('class'))
  if (checkIgnore(ignore.class, className)) {
    return false
  }
  const matches = parent.getElementsByClassName(className)
  if (matches.length === 1) {
    path.unshift(`.${className.trim().replace(/\s+/g, '.')}`)
    return true
  }
  return false
}

/**
 * Lookup attribute identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {Object}         ignore  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
 */
function checkAttribute (element, path, ignore, parent, priority) {
  const attributes = element.attributes
  return Object.keys(attributes).sort(orderByPriority(attributes, priority)).some((key) => {
    const attribute = attributes[key]
    const attributeName = attribute.name
    const attributeValue = escapeValue(attribute.value)
    if (checkIgnore(ignore.attribute, attributeName, attributeValue, defaultIgnore.attribute)) {
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
 * Lookup tag identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @param  {Object}         ignore  - [description]
 * @return {boolean}                - [description]
 */
function checkTag (element, path, ignore, parent) {
  const tagName = element.tagName.toLowerCase()
  if (checkIgnore(ignore.tag, tagName)) {
    return false
  }
  const matches = parent.getElementsByTagName(tagName)
  if (matches.length === 1) {
    path.unshift(tagName)
    return true
  }
  return false
}

/**
 * Lookup child identfier
 *
 * Note: childTags is a custom property to use a view filter for tags on for virutal elements
 *
 * @param  {HTMLElement}    element  - [description]
 * @param  {Array.<string>} path     - [description]
 * @param  {String}         selector - [description]
 * @return {boolean}                 - [description]
 */
function checkChild (element, path, selector) {
  const parent = element.parentNode
  const children = parent.childTags || parent.children
  for (var i = 0, l = children.length; i < l; i++) {
    if (children[i] === element) {
      path.unshift(`> ${selector}:nth-child(${i+1})`)
      return true
    }
  }
  return false
}

/**
 * Validate with custom and default functions
 *
 * @param  {Function} predicate        - [description]
 * @param  {string}   name             - [description]
 * @param  {string}   value            - [description]
 * @param  {Function} defaultPredicate - [description]
 * @return {boolean}                   - [description]
 */
function checkIgnore (predicate, name, value, defaultPredicate) {
  if (!name) {
    return true
  }
  const check = predicate || defaultPredicate
  if (!check) {
    return false
  }
  return check(name, value || name, defaultPredicate)
}

/**
 * Rank the attribute names by their general relevance for a website
 *
 * @param  {Object}   attributes - [description]
 * @param  {Array}    priority   - [description]
 * @return {Function}            - [description]
 */
function orderByPriority (attributes, priority) {
  return (curr, next) => {
    return priority.indexOf(attributes[curr].name) - priority.indexOf(attributes[next].name)
  }
}
