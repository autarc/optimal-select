/**
 * # Match
 *
 * Retrieve selector for a node.
 */

import { createPattern, getToString } from './pattern'
import { getSelect } from './selector'
import { escapeValue } from './utilities'

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
 * @typedef {import('./pattern').ToStringApi} Pattern
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
  const select = getSelect(options)
  const toString = getToString(options)

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
      if (checkAttributes(priority, element, ignore, path, select, toString, root)) break
      if (checkTag(element, ignore, path, select, toString, root)) break

      // ~ local
      checkAttributes(priority, element, ignore, path, select, toString)
      if (path.length === length) {
        checkTag(element, ignore, path, select, toString)
      }

      if ([1, 'xpath', 'jquery'].includes(format) && path.length === length) {
        checkContains(priority, element, ignore, path, select, toString, format === 'jquery')
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
    const pattern = findPattern(priority, element, ignore, select, toString)
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
 * @param  {ToStringApi}    toString - [description]
 * @param  {HTMLElement}    parent   - [description]
 * @return {boolean}                 - [description]
 */
const checkAttributes = (priority, element, ignore, path, select, toString, parent = element.parentNode) => {
  const pattern = findAttributesPattern(priority, element, ignore, select, toString, parent)
  if (pattern) {
    path.unshift(pattern)
    return true
  }
  return false
}

/**
 * Get combinations
 *
 * @param  {Array.<string>} values   - [description]
 * @return {Array.<string>?}        - [description]
 */
const combinations = (values) => {
  let result = [[]]

  values.forEach(c => {
    result.forEach(r => result.push(r.concat(c)))
  })

  result.shift()
  return result
}

/**
 * Get class selector
 *
 * @param  {Array.<string>} classes - [description]
 * @param  {function}       select  - [description]
 * @param  {ToStringApi}    toString - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @param  {Pattern}        base    - [description]
 * @return {Array.<string>?}        - [description]
 */
const getClassSelector = (classes = [], select, toString, parent, base) => {
  let result = combinations(classes)

  for(let i = 0; i < result.length; i++) {
    const pattern = toString.pattern({ ...base, classes: result[i] })
    const matches = select(pattern, parent)
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
 * @param  {ToStringApi}    toString  - [description]
 * @param  {ParentNode}     parent    - [description]
 * @return {Pattern?}                 - [description]
 */
const findAttributesPattern = (priority, element, ignore, select, toString, parent = element.parentNode) => {
  const attributes = element.attributes
  var attributeNames = Object.keys(attributes).map((val) => attributes[val].name)
    .filter((a) => priority.indexOf(a) < 0)

  var sortedKeys = [ ...priority, ...attributeNames ]
  var pattern = createPattern()
  pattern.tag = element.tagName.toLowerCase()

  var isOptimal = (pattern) => (select(toString.pattern(pattern), parent).length === 1)

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
          const classes = getClassSelector(classNames, select, toString, parent, pattern)
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

  return null
}


/**
 * Extend path with tag identifier
 *
 * @param  {HTMLElement}     element - [description]
 * @param  {Object}          ignore  - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}        select  - [description]
 * @param  {ToStringApi}     toString - [description]
 * @param  {HTMLElement}     parent  - [description]
 * @return {boolean}                 - [description]
 */
const checkTag = (element, ignore, path, select, toString, parent = element.parentNode) => {
  const pattern = findTagPattern(element, ignore)
  if (pattern) {
    let matches = []
    matches = select(toString.pattern(pattern), parent)
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
 * @return {Pattern?}            - [description]
 */
const findTagPattern = (element, ignore) => {
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
const checkChilds = (priority, element, ignore, path) => {
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
 * @param  {ToStringApi}    toString - [description]
 * @param  {boolean}        nested   - [description]
 * @return {boolean}                 - [description]
 */
const checkContains = (priority, element, ignore, path, select, toString, nested) => {
  const pattern = findTagPattern(element, ignore, select)
  if (!pattern) {
    return false
  }
  const textContent = (nested ? element.textContent : (element.firstChild && element.firstChild.nodeValue) || '')
  if (!textContent) {
    return false
  }

  pattern.relates = 'child'
  const parent = element.parentNode
  const texts = textContent
    .replace(/\n+/g, '\n')
    .split('\n')
    .map(text => text.trim())
    .filter(text => text.length > 0)

  const contains = []

  while (texts.length > 0) {
    const text = texts.shift()
    if (checkIgnore(ignore.contains, null, text)) {
      break
    }
    contains.push(`contains("${text}")`)
  
    const matches = select(toString.pattern({ ...pattern, pseudo: contains }), parent)
    if (matches.length === 1) {
      pattern.pseudo = contains
      path.unshift(pattern)
      return true
    }
    if (matches.length === 0) {
      return false
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
 * @param  {ToStringApi}    toString - [description]
 * @return {Pattern}                 - [description]
 */
const findPattern = (priority, element, ignore, select, toString) => {
  var pattern = findAttributesPattern(priority, element, ignore, select, toString)
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
const checkIgnore = (predicate, name, value, defaultPredicate) => {
  if (!value) {
    return true
  }
  const check = predicate || defaultPredicate
  if (!check) {
    return false
  }
  return check(name, value, defaultPredicate)
}
