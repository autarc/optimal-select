/**
 * # Match
 *
 * Retrieve selector for a node.
 */

import { createPattern, patternToString, pseudoToString } from './pattern'
import { getSelect } from './common'
import { escapeValue } from './utilities'

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
 */

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
 * @param  {HTMLElement} node      - [description]
 * @param  {Options}     [options] - [description]
 * @return {Array.<Pattern>}       - [description]
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
        checkChilds(priority, element, ignore, path)
      }
    }

    element = element.parentNode
    length = path.length
  }

  if (element === root) {
    const pattern = findPattern(priority, element, ignore, select)
    path.unshift(pattern)
  }

  return path
}

/**
 * Extend path with attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}       select   - [description]
 * @param  {HTMLElement}    parent   - [description]
 * @return {boolean}                 - [description]
 */
function checkAttributes (priority, element, ignore, path, select, parent = element.parentNode) {
  const pattern = findAttributesPattern(priority, element, ignore, select, parent)
  if (pattern) {
    const matches = select(patternToString(pattern), parent)
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
 * @param  {Pattern}        base    - [description]
 * @return {Array.<string>?}        - [description]
 */
function getClassSelector(classes = [], select, parent, base) {
  let result = [[]]

  classes.forEach(function(c) {
    result.forEach(function(r) {
      result.push(r.concat(c))
    })
  })

  result.shift()
  result = result.sort(function(a,b) { return a.length - b.length })

  const prefix = patternToString(base)

  for(let i = 0; i < result.length; i++) {
    const matches = select(`${prefix}.${result[i].join('.')}`, parent)
    if (matches.length === 1) {
      return result[i]
    }
  }

  return null
}

/**
 * Lookup attribute identifier
 *
 * @param  {Array.<string>} priority  - [description]
 * @param  {HTMLElement}    element   - [description]
 * @param  {Object}         ignore    - [description]
 * @param  {function}       select    - [description]
 * @param  {ParentNode}     parent    - [description]
 * @return {Pattern?}                 - [description]
 */
function findAttributesPattern (priority, element, ignore, select, parent = element.parentNode) {
  const attributes = element.attributes
  var attributeNames = Object.keys(attributes).map((val) => attributes[val].name)
    .filter((a) => priority.indexOf(a) < 0)

  var sortedKeys = [ ...priority, ...attributeNames ]
  var pattern = createPattern()
  pattern.tag = element.tagName.toLowerCase()

  var isOptimal = (pattern) => (select(patternToString(pattern), parent).length === 1)

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

    switch (attributeName) {
      case 'class': {
        let classNames = attributeValue.trim().split(/\s+/g)
        const classIgnore = ignore.class || defaultIgnore.class
        if (classIgnore) {
          classNames = classNames.filter(className => !classIgnore(className))
        }
        if (classNames.length > 0) {
          const classes = getClassSelector(classNames, select, parent, pattern)
          if (classes) {
            pattern.classes = classes
            if (isOptimal(pattern)) {
              return pattern
            }
          }
        }
      }
        break

      default:
        pattern.attributes.push({ name: attributeName, value: attributeValue })
        if (isOptimal(pattern)) {
          return pattern
        }
    }
  }

  return null // pattern
}


/**
 * Extend path with tag identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Object}         ignore  - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}       select  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
 */
function checkTag (element, ignore, path, select, parent = element.parentNode) {
  const pattern = findTagPattern(element, ignore)
  if (pattern) {
    let matches = []
    matches = select(patternToString(pattern), parent)
    if (matches.length === 1) {
      path.unshift(pattern)
      if (pattern.tag === 'iframe') {
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
 * @return {Pattern?}             - [description]
 */
function findTagPattern (element, ignore) {
  const tagName = element.tagName.toLowerCase()
  if (checkIgnore(ignore.tag, null, tagName)) {
    return null
  }
  const pattern = createPattern()
  pattern.tag = tagName
  return pattern
}

/**
 * Extend path with specific child identifier
 *
 * NOTE: 'childTags' is a custom property to use as a view filter for tags using 'adapter.js'
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @return {boolean}                 - [description]
 */
function checkChilds (priority, element, ignore, path) {
  const parent = element.parentNode
  const children = parent.childTags || parent.children
  for (var i = 0, l = children.length; i < l; i++) {
    const child = children[i]
    if (child === element) {
      const childPattern = findTagPattern(child, ignore)
      if (!childPattern) {
        return console.warn(`
          Element couldn't be matched through strict ignore pattern!
        `, child, ignore, childPattern)
      }
      childPattern.relates = 'child'
      childPattern.pseudo = [`nth-child(${i+1})`]
      path.unshift(childPattern)
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
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}       select   - [description]
 * @return {boolean}                 - [description]
 */
function checkContains (priority, element, ignore, path, select) {
  const pattern = findTagPattern(element, ignore, select)
  if (!pattern) {
    return false
  }
  const parent = element.parentNode
  const texts = element.textContent
    .replace(/\n+/g, '\n')
    .split('\n')
    .map(text => text.trim())
    .filter(text => text.length > 0)

  pattern.relates = 'child'
  const prefix = patternToString(pattern)
  const contains = []

  while (texts.length > 0) {
    contains.push(`contains("${texts.shift()}")`)
    if (select(`${prefix}${pseudoToString(contains)}`, parent).length === 1) {
      pattern.pseudo = [...pattern.pseudo, ...contains]
      path.unshift(pattern)
      return true
    }
  }
  return false
}

/**
 * Lookup identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {function}       select   - [description]
 * @return {Pattern}                  - [description]
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
