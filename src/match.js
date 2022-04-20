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
  },
  contains: () => true
}

export const initOptions = (options = {}) => ({
  ...options,
  root: options.root || document,
  skip: options.skip || null,
  priority: options.priority || ['id', 'class', 'href', 'src'],
  ignore: options.ignore || {}
})

/**
 * Get the path of the element
 *
 * @param  {HTMLElement} node      - [description]
 * @param  {Options}     [options] - [description]
 * @return {Array.<Pattern>}       - [description]
 */
export default function match (node, options = {}, nested = false) {
  options = initOptions(options)
  const { root, skip, ignore, format } = options

  const path = []
  let element = node
  let length = path.length
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
      if (checkAttributes(element, path, options, select, toString, root)) break
      if (checkTag(element, path, options, select, toString, root)) break

      // ~ local
      checkAttributes(element, path, options, select, toString)
      if (path.length === length) {
        checkTag(element, path, options, select, toString)
      }

      if (path.length === length && [1, 'xpath'].includes(format) && !nested && element === node) {
        checkRecursiveDescendants(element, path, options, select, toString)
      }

      if (path.length === length && [1, 'xpath', 'jquery'].includes(format)) {
        checkText(element, path, options, select, toString, format === 'jquery')
      }

      if (path.length === length) {
        checkNthChild(element, path, options)
      }
    }

    element = element.parentNode
    length = path.length
  }

  if (element === root) {
    const pattern = findPattern(element, options, select, toString)
    path.unshift(pattern)
  }

  return path
}

/**
 * Extend path with attribute identifier
 *
 * @param  {HTMLElement}     element  - [description]
 * @param  {Array.<Pattern>} path     - [description]
 * @param  {Options}         options  - [description]
 * @param  {function}        select   - [description]
 * @param  {ToStringApi}     toString - [description]
 * @param  {HTMLElement}     parent   - [description]
 * @return {boolean}                  - [description]
 */
const checkAttributes = (element, path, { priority, ignore }, select, toString, parent = element.parentNode) => {
  const pattern = findAttributesPattern(priority, element, ignore, select, toString, parent)
  if (pattern) {
    path.unshift(pattern)
    return true
  }
  return false
}

/**
 * Calculates array of combinations of items in input array.
 * @param  {Array.<any>} values   - array of values
 * @param  {Object} options       - options: min - minimum subset size; max - maximum subset size
 * @return {Array.<Array.<any>>?}   array of subsets
 */
export const combinations = (values, options) => {
  const { min, max } = options || {}
  const result = [[]]

  values.forEach(v => {
    result.forEach(r => {
      if (!max || r.length < max) {
        result.push(r.concat(v))
      }
    })
  })

  result.shift()
  return min ? result.filter(r => r.length >= min) : result
}

// limit subset size to increase performance
const maxSubsetSize = [
  { items: 13, max: 1 },
  { items: 10, max: 2 },
  { items: 8, max: 3 },
  { items: 5, max: 4 }
]

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
  const { max } =
    maxSubsetSize.find(({ items }) => classes.length > items) || { max: classes.length }

  let result = combinations(classes, { max })

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
        if (!classNames[0]) { // empty string
          break
        }
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
 * @param  {Options}         options  - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}        select  - [description]
 * @param  {ToStringApi}     toString - [description]
 * @param  {HTMLElement}     parent  - [description]
 * @return {boolean}                 - [description]
 */
const checkTag = (element, path, { ignore }, select, toString, parent = element.parentNode) => {
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
 * @param  {HTMLElement}     element - [description]
 * @param  {Options}         options - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @return {boolean}                 - [description]
 */
const checkNthChild = (element, path, { ignore }) => {
  const parent = element.parentNode
  const children = parent.children
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
 * @param  {HTMLElement}     element  - [description]
 * @param  {Array.<Pattern>} path     - [description]
 * @param  {Options}         options  - [description]
 * @param  {function}        select   - [description]
 * @param  {ToStringApi}     toString - [description]
 * @param  {boolean}         nested   - [description]
 * @return {boolean}                  - [description]
 */
const checkText = (element, path, { ignore }, select, toString, nested) => {
  const pattern = findTagPattern(element, ignore)
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
    if (checkIgnore(ignore.contains, null, text, defaultIgnore.contains)) {
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
 * Extend path with descendant tag
 *
 * @param  {HTMLElement}     element  - [description]
 * @param  {Array.<Pattern>} path     - [description]
 * @param  {Options}         options  - [description]
 * @param  {function}        select   - [description]
 * @param  {ToStringApi}     toString - [description]
 * @return {boolean}                  - [description]
 */
const checkRecursiveDescendants = (element, path, options, select, toString) => {
  const pattern = findTagPattern(element, options.ignore)
  if (!pattern) {
    return false
  }

  const descendants = Array.from(element.querySelectorAll('*'))
  while (descendants.length > 0) {
    const descendantPath = match(descendants.shift(), { ...options, root: element }, true)
    // avoid descendant selectors with nth-child
    if (!descendantPath.some(pattern => pattern.pseudo.some(p => p.startsWith('nth-child')))) {
      const parent = element.parentElement
      const matches = select(toString.pattern({ ...pattern, descendants: [descendantPath] }), parent)
      if (matches.length === 1) {
        pattern.descendants = [descendantPath]
        path.unshift(pattern)
        return true
      }
    }
  }

  return false
}

/**
 * Lookup identifier
 *
 * @param  {HTMLElement}    element  - [description]
 * @param  {Options}        options   - [description]
 * @param  {function}       select   - [description]
 * @param  {ToStringApi}    toString - [description]
 * @return {Pattern}                 - [description]
 */
const findPattern = (element, { priority, ignore }, select, toString) => {
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
