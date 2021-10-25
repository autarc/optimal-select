/**
 * # Match
 *
 * Retrieve selector for a node.
 */

import { getSelect } from './common'
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
export default function match (node, options = {}) {

  const {
    root = document,
    skip = null,
    priority = ['id', 'class', 'href', 'src'],
    ignore = {},
    format
  } = options

  const path = []
  var element = node
  var length = path.length
  const jquery = (format === 'jquery')
  const select = getSelect(options)

  const skipCompare = skip && (Array.isArray(skip) ? skip : [skip]).map((entry) => {
    if (typeof entry !== 'function') {
      return (element) => element === entry
    }
    return entry
  })

  const skipChecks = (element) => {
    return skip && skipCompare.some((compare) => compare(element))
  }

  Object.keys(ignore).forEach((type) => {
    var predicate = ignore[type]
    if (typeof predicate === 'function') return
    if (typeof predicate === 'number') {
      predicate = predicate.toString()
    }
    if (typeof predicate === 'string') {
      predicate = new RegExp(escapeValue(predicate).replace(/\\/g, '\\\\'))
    }
    if (typeof predicate === 'boolean') {
      predicate = predicate ? /(?:)/ : /.^/
    }
    // check class-/attributename for regex
    ignore[type] = (name, value) => predicate.test(value)
  })

  while (element !== root && element.nodeType !== 11) {
    if (skipChecks(element) !== true) {
      // ~ global
      if (checkAttributes(priority, element, ignore, path, select, root)) break
      if (checkTag(element, ignore, path, select, root)) break

      // ~ local
      checkAttributes(priority, element, ignore, path, select)
      if (path.length === length) {
        checkTag(element, ignore, path, select)
      }

      if (jquery && path.length === length) {
        checkContains(priority, element, ignore, path, select)
      }

      // define only one part each iteration
      if (path.length === length) {
        checkChilds(priority, element, ignore, path, select)
      }
    }

    element = element.parentNode
    length = path.length
  }

  if (element === root) {
    const pattern = findPattern(priority, element, ignore, select)
    path.unshift(pattern)
  }

  return path.join(' ')
}

/**
 * Extend path with attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<string>} path     - [description]
 * @param  {HTMLElement}    parent   - [description]
 * @return {boolean}                 - [description]
 */
function checkAttributes (priority, element, ignore, path, select, parent = element.parentNode) {
  const pattern = findAttributesPattern(priority, element, ignore, select, parent)
  if (pattern) {
    const matches = select(pattern, parent)
    if (matches.length === 1) {
      path.unshift(pattern)
      return true
    }
  }
  return false
}

/**
 * Get class selector
 *
 * @param  {Array.<string>} classes - [description]
 * @param  {function}       select  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {string?}                - [description]
 */
function getClassSelector(classes = [], select, parent) {
  let result = [[]]

  classes.forEach(function(c) {
    result.forEach(function(r) {
      result.push(r.concat('.' + c))
    })
  })

  result.shift()

  result = result.sort(function(a,b) { return a.length - b.length })

  for(let i = 0; i < result.length; i++) {
    let r = result[i].join('')
    const matches = select(r, parent)
    if (matches.length === 1) {
      return r
    }
  }

  return null
}

/**
 * Lookup attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]

 * @return {string?}                 - [description]
 */
function findAttributesPattern (priority, element, ignore, select, parent = element.parentNode) {
  const attributes = element.attributes
  var attributeNames = Object.keys(attributes).map((val) => attributes[val].name)
    .filter((a) => priority.indexOf(a) < 0)

  var sortedKeys = [ ...priority, ...attributeNames ]

  var tagName = element.tagName.toLowerCase()

  for (var i = 0, l = sortedKeys.length; i < l; i++) {
    const key = sortedKeys[i]
    const attribute = attributes[key]
    const attributeName = escapeValue(attribute && attribute.name)
    const attributeValue = escapeValue(attribute && attribute.value)
    const useNamedIgnore = attributeName !== 'class'

    const currentIgnore = (useNamedIgnore && ignore[attributeName]) || ignore.attribute
    const currentDefaultIgnore = (useNamedIgnore && defaultIgnore[attributeName]) || defaultIgnore.attribute
    if (checkIgnore(currentIgnore, attributeName, attributeValue, currentDefaultIgnore)) {
      continue
    }

    var pattern = `[${attributeName}="${attributeValue}"]`
    if(!attributeValue.trim()) {
      return null
    }

    if (attributeName === 'id') {
      pattern = `#${attributeValue}`
    }

    if (attributeName === 'class') {
      let classNames = attributeValue.trim().split(/\s+/g)
      const classIgnore = ignore.class || defaultIgnore.class
      if (classIgnore) {
        classNames = classNames.filter(className => !classIgnore(className))
      }
      if (classNames.length === 0) {
        continue
      }
      pattern = getClassSelector(classNames, select, parent)

      if (!pattern) {
        continue
      }
    }

    return tagName + pattern
  }
  return null
}

/**
 * Extend path with tag identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Object}         ignore  - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {function}       select  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
 */
function checkTag (element, ignore, path, select, parent = element.parentNode) {
  const pattern = findTagPattern(element, ignore)
  if (pattern) {
    let matches = []
    matches = select(pattern, parent)
    if (matches.length === 1) {
      path.unshift(pattern)
      if (pattern === 'iframe') {
        return false
      }
      return true
    }
  }
  return false
}

/**
 * Lookup tag identifier
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      ignore  - [description]
 * @return {boolean}             - [description]
 */
function findTagPattern (element, ignore) {
  const tagName = element.tagName.toLowerCase()
  if (checkIgnore(ignore.tag, null, tagName)) {
    return null
  }
  return tagName
}

/**
 * Extend path with specific child identifier
 *
 * NOTE: 'childTags' is a custom property to use as a view filter for tags using 'adapter.js'
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<string>} path     - [description]
 * @return {boolean}                 - [description]
 */
function checkChilds (priority, element, ignore, path, select) {
  const parent = element.parentNode
  const children = parent.childTags || parent.children
  for (var i = 0, l = children.length; i < l; i++) {
    const child = children[i]
    if (child === element) {
      const childPattern = findPattern(priority, child, ignore, select)
      if (!childPattern) {
        return console.warn(`
          Element couldn't be matched through strict ignore pattern!
        `, child, ignore, childPattern)
      }
      const pattern = `> ${childPattern}:nth-child(${i+1})`
      path.unshift(pattern)
      return true
    }
  }
  return false
}

/**
 * Extend path with contains
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<string>} path     - [description]
 * @return {boolean}                 - [description]
 */
function checkContains (priority, element, ignore, path, select) {
  const elementPattern = findPattern(priority, element, ignore, select)
  const text = element.textContent.trim()
  if (text.length > 0 && text.indexOf('\n') < 0) {
    const parent = element.parentNode
    const children = parent.childTags || parent.children
    for (var i = 0, l = children.length; i < l; i++) {
      const child = children[i]
      if (child !== element) {
        if (child.textContent.indexOf(text) > 0) {
          return false
        }
      }
    }
    const pattern = `${elementPattern}:contains("${text}")`
    path.unshift(pattern)
    return true
  }
  return false
}

/**
 * Lookup identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @return {string}                  - [description]
 */
function findPattern (priority, element, ignore, select) {
  var pattern = findAttributesPattern(priority, element, ignore, select)
  if (!pattern) {
    pattern = findTagPattern(element, ignore)
  }
  return pattern
}

/**
 * Validate with custom and default functions
 *
 * @param  {Function} predicate        - [description]
 * @param  {string?}  name             - [description]
 * @param  {string}   value            - [description]
 * @param  {Function} defaultPredicate - [description]
 * @return {boolean}                   - [description]
 */
function checkIgnore (predicate, name, value, defaultPredicate) {
  if (!value) {
    return true
  }
  const check = predicate || defaultPredicate
  if (!check) {
    return false
  }
  return check(name, value, defaultPredicate)
}
