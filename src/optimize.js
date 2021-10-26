/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
 */

import adapt from './adapt'
import { getSelect } from './common'
import { convertNodeList } from './utilities'

/**
 * Apply different optimization techniques
 *
 * @param  {string}                          selector - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element  - [description]
 * @param  {Object}                          options  - [description]
 * @return {string}                                   - [description]
 */
export default function optimize (selector, elements, options = {}) {

  if (selector.startsWith('> ')) {
    selector = selector.replace('> ', '')
  }

  // convert single entry and NodeList
  if (!Array.isArray(elements)) {
    elements = !elements.length ? [elements] : convertNodeList(elements)
  }

  if (!elements.length || elements.some((element) => element.nodeType !== 1)) {
    throw new Error('Invalid input - to compare HTMLElements its necessary to provide a reference of the selected node(s)! (missing "elements")')
  }

  const globalModified = adapt(elements[0], options)
  const select = getSelect(options)

  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729, https://stackoverflow.com/a/16261693)
  // var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/)
  var path = selector.replace(/> /g, '>').match(/(?:[^\s"]+|"[^"]*")+/g)

  if (path.length < 2) {
    return optimizePart('', selector, '', elements, select)
  }

  var endOptimized = false
  if (/>/.test(path[path.length-1])) {
    path[path.length-1] = optimizePart(path.slice(0, -1).join(' '), path[path.length-1], '', elements, select)
    endOptimized = true
  }

  const shortened = [path.pop()]
  while (path.length > 1)  {
    const current = path.pop()
    const prePart = path.join(' ')
    const postPart = shortened.join(' ')

    const pattern = `${prePart} ${postPart}`
    const matches = select(pattern)
    const hasSameResult = matches.length === elements.length && elements.every((element, i) => element === matches[i])
    if (!hasSameResult) {
      shortened.unshift(optimizePart(prePart, current, postPart, elements, select))
    }
  }
  shortened.unshift(path[0])
  path = shortened

  // optimize start + end
  path[0] = optimizePart('', path[0], path.slice(1).join(' '), elements, select)
  if (!endOptimized) {
    path[path.length-1] = optimizePart(path.slice(0, -1).join(' '), path[path.length-1], '', elements, select)
  }

  if (globalModified) {
    delete global.document
  }

  return path.join(' ').replace(/>/g, '> ').trim()
}

/**
 * Improve a chunk of the selector
 *
 * @param  {string}              prePart  - [description]
 * @param  {string}              current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {string}                       - [description]
 */
function optimizePart (prePart, current, postPart, elements, select) {
  if (prePart.length) prePart = `${prePart} `
  if (postPart.length) postPart = ` ${postPart}`

  // optimize contains
  if (/:contains\(/.test(current) && postPart.length) {
    let firstIndex = current.indexOf(':')
    let containsIndex = current.lastIndexOf(':contains(')
    let optimized = current.slice(0, containsIndex)
    while (containsIndex > firstIndex && compareResults(select(`${prePart}${optimized}${postPart}`), elements)) {
      current = optimized
      containsIndex = current.lastIndexOf(':contains(')
      optimized = current.slice(0, containsIndex)
    }
  }

  // robustness: attribute without value (generalization)
  if (/\[*\]/.test(current)) {
    const key = current.replace(/=.*$/, ']')
    var pattern = `${prePart}${key}${postPart}`
    var matches = select(pattern)
    if (compareResults(matches, elements)) {
      current = key
    } else {
      // robustness: replace specific key-value with base tag (heuristic)
      const references = select(`${prePart}${key}`)
      for (var i = 0, l = references.length; i < l; i++) {
        const reference = references[i]
        if (elements.some((element) => reference.contains(element))) {
          const description = reference.tagName.toLowerCase()
          var pattern2 = `${prePart}${description}${postPart}`
          var matches2 = select(pattern2)
          if (compareResults(matches2, elements)) {
            current = description
          }
          break
        }
      }
    }
  }

  // robustness: descendant instead child (heuristic)
  if (/>/.test(current)) {
    const descendant = current.replace(/>/, '')
    var pattern3 = `${prePart}${descendant}${postPart}`
    var matches3 = select(pattern3)
    if (compareResults(matches3, elements)) {
      current = descendant
    }
  }

  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (/:nth-child/.test(current)) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    const type = current.replace(/nth-child/g, 'nth-of-type')
    var pattern4 = `${prePart}${type}${postPart}`
    var matches4 = select(pattern4)
    if (compareResults(matches4, elements)) {
      current = type
    }
  }

  // efficiency: combinations of classname (partial permutations)
  if (/^\.\S*[^\s\\]\.\S+/.test(current)) {
    var names = current.trim()
      .replace(/(^|[^\\])\./g, '$1#.') // escape actual dots
      .split('#.') // split only on actual dots
      .slice(1)
      .map((name) => `.${name}`)
      .sort((curr, next) => curr.length - next.length)
    while (names.length) {
      const partial = current.replace(names.shift(), '').trim()
      var pattern5 = `${prePart}${partial}${postPart}`.trim()
      if (!pattern5.length || pattern5.charAt(0) === '>' || pattern5.charAt(pattern5.length-1) === '>') {
        break
      }
      var matches5 = select(pattern5)
      if (compareResults(matches5, elements)) {
        current = partial
      }
    }

    // robustness: degrade complex classname (heuristic)
    names = current && current.match(/\./g)
    if (names && names.length > 2) {
      const references = select(`${prePart}${current}`)
      for (var i2 = 0, l2 = references.length; i2 < l2; i2++) {
        const reference = references[i2]
        if (elements.some((element) => reference.contains(element) )) {
          // TODO:
          // - check using attributes + regard excludes
          const description = reference.tagName.toLowerCase()
          var pattern6 = `${prePart}${description}${postPart}`
          var matches6 = select(pattern6)
          if (compareResults(matches6, elements)) {
            current = description
          }
          break
        }
      }
    }
  }

  return current
}

/**
 * Evaluate matches with expected elements
 *
 * @param  {Array.<HTMLElement>} matches  - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {Boolean}                      - [description]
 */
function compareResults (matches, elements) {
  const { length } = matches
  return length === elements.length && elements.every((element) => {
    for (var i = 0; i < length; i++) {
      if (matches[i] === element) {
        return true
      }
    }
    return false
  })
}
