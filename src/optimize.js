/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
 */

import adapt from './adapt'
import { getSelect } from './common'
import { pathToString, patternToString, pseudoToString, attributesToString, classesToString } from './pattern'
import { convertNodeList, partition } from './utilities'

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
 */

/**
 * Apply different optimization techniques
 *
 * @param  {Array.<Pattern>}                 path   - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element    - [description]
 * @param  {Options}                         [options]  - [description]
 * @return {string}                                     - [description]
 */
export default function optimize (path, elements, options = {}) {
  if (path.length === 0) {
    return ''
  }

  if (path[0].relates === 'child') {
    path[0].relates = undefined
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

  if (path.length < 2) {
    return patternToString(optimizePart('', path[0], '', elements, select))
  }

  var endOptimized = false
  if (path[path.length-1].relates === 'child') {
    path[path.length-1] = optimizePart(pathToString(path.slice(0, -1)), path[path.length-1], '', elements, select)
    endOptimized = true
  }

  const shortened = [path.pop()]
  while (path.length > 1) {
    const current = path.pop()
    const prePart = pathToString(path)
    const postPart = pathToString(shortened)

    const matches = select(`${prePart} ${postPart}`)
    const hasSameResult = matches.length === elements.length && elements.every((element, i) => element === matches[i])
    if (!hasSameResult) {
      shortened.unshift(optimizePart(prePart, current, postPart, elements, select))
    }
  }
  shortened.unshift(path[0])
  path = shortened

  // optimize start + end
  path[0] = optimizePart('', path[0], pathToString(path.slice(1)), elements, select)
  if (!endOptimized) {
    path[path.length-1] = optimizePart(pathToString(path.slice(0, -1)), path[path.length-1], '', elements, select)
  }

  if (globalModified) {
    delete global.document
  }

  return pathToString(path) // path.join(' ').replace(/>/g, '> ').trim()
}

/**
 * Optimize :contains
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeContains (prePart, current, postPart, elements, select) {
  const [contains, other] = partition(current.pseudo, (item) => /contains\("/.test(item))
  const prefix = patternToString({ ...current, pseudo: [] })

  if (contains.length > 0 && postPart.length) {
    const optimized = [...other, ...contains]
    while (optimized.length > other.length) {
      optimized.pop()
      const pattern = `${prePart}${prefix}${pseudoToString(optimized)}${postPart}`
      if (!compareResults(select(pattern), elements)) {
        break
      }
      current.pseudo = optimized
    }
  }
  return current
}

/**
 * Optimize attributes
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeAttributes (prePart, current, postPart, elements, select) {
  // reduce attributes: first try without value, then removing completely
  if (current.attributes.length > 0) {
    let attributes = [...current.attributes]
    let prefix = patternToString({ ...current, attributes: [] })

    const simplify = (original, getSimplified) => {
      let i = original.length - 1
      while (i >= 0) {
        let attributes = getSimplified(original, i)
        if (!compareResults(
          select(`${prePart}${prefix}${attributesToString(attributes)}${postPart}`),
          elements
        )) {
          break
        }
        i--
        original = attributes
      }
      return original
    }

    const simplified = simplify(attributes, (attributes, i) => {
      const { name } = attributes[i]
      if (name === 'id') {
        return attributes
      }
      return [...attributes.slice(0, i), { name, value: null }, ...attributes.slice(i + 1)]
    })

    return { ...current, attributes: simplify(simplified, attributes => attributes.slice(0, -1)) }
  }
  return current
}

/**
 * Optimize descendant
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeDescendant (prePart, current, postPart, elements, select) {
  // robustness: descendant instead child (heuristic)
  if (current.relates === 'child') {
    const descendant = { ...current, relates: undefined }
    let matches = select(`${prePart}${patternToString(descendant)}${postPart}`)
    if (compareResults(matches, elements)) {
      return descendant
    }
  }
  return current
}

/**
 * Optimize nth of type
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeNthOfType (prePart, current, postPart, elements, select) {
  const i = current.pseudo.findIndex(item => item.startsWith('nth-child'))
  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (i >= 0) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    const type = current.pseudo[i].replace(/^nth-child/, 'nth-of-type')
    const nthOfType = { ...current, pseudo: [...current.pseudo.slice(0, i), type, ...current.pseudo.slice(i + 1)] }
    var pattern = `${prePart}${patternToString(nthOfType)}${postPart}`
    var matches = select(pattern)
    if (compareResults(matches, elements)) {
      current = nthOfType
    }
  }
  return current
}

/**
 * Optimize classes
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeClasses (prePart, current, postPart, elements, select) {
  // efficiency: combinations of classname (partial permutations)
  if (current.classes.length > 1) {
    let optimized = current.classes.slice().sort((curr, next) => curr.length - next.length)
    let prefix = patternToString({ ...current, classes: [] })

    while (optimized.length > 1) {
      optimized.shift()
      const pattern = `${prePart}${prefix}${classesToString(optimized)}${postPart}`
      if (!pattern.length || pattern.charAt(0) === '>' || pattern.charAt(pattern.length-1) === '>') {
        break
      }
      if (!compareResults(select(pattern), elements)) {
        break
      }
      current.classes = optimized
    }

    optimized = current.classes
    if (optimized.length > 2) {
      const references = select(`${prePart}${classesToString(current)}`)
      for (var i2 = 0, l2 = references.length; i2 < l2; i2++) {
        const reference = references[i2]
        if (elements.some((element) => reference.contains(element))) {
          // TODO:
          // - check using attributes + regard excludes
          const description = reference.tagName.toLowerCase()
          var pattern = `${prePart}${description}${postPart}`
          var matches = select(pattern)
          if (compareResults(matches, elements)) {
            current = { tag: description }
          }
          break
        }
      }
    }
  }
  return current
}

const optimizers = [
  optimizeContains,
  optimizeAttributes,
  optimizeDescendant,
  optimizeNthOfType,
  optimizeClasses,
]

/**
 * Improve a chunk of the selector
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizePart (prePart, current, postPart, elements, select) {
  if (prePart.length) prePart = `${prePart} `
  if (postPart.length) postPart = ` ${postPart}`

  return optimizers.reduce((acc, optimizer) => optimizer(prePart, acc, postPart, elements, select), current)
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
