/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
 */

import adapt from './adapt'
import { getSelect } from './selector'
import { createPattern, getToString } from './pattern'
import { convertNodeList, partition } from './utilities'

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
 * @typedef {import('./pattern').ToStringApi} Pattern
 */

/**
 * Apply different optimization techniques
 *
 * @param  {Array.<Pattern>}                 path   - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element    - [description]
 * @param  {Options}                         [options]  - [description]
 * @return {Array.<Pattern>}                            - [description]
 */
export default function optimize (path, elements, options = {}) {
  if (path.length === 0) {
    return []
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
  const toString = getToString(options)

  if (path.length === 1) {
    return [optimizePart([], path[0], [], elements, select, toString)]
  }

  var endOptimized = false
  if (path[path.length-1].relates === 'child') {
    path[path.length-1] = optimizePart(path.slice(0, -1), path[path.length-1], [], elements, select, toString)
    endOptimized = true
  }

  path = [...path]
  const shortened = [path.pop()]
  while (path.length > 1) {
    const current = path.pop()
    const matches = select(toString.path([...path, ...shortened]))
    const hasSameResult = matches.length === elements.length && elements.every((element, i) => element === matches[i])
    if (!hasSameResult) {
      shortened.unshift(optimizePart(path, current, shortened, elements, select, toString))
    }
  }
  shortened.unshift(path[0])
  path = shortened

  // optimize start + end
  path[0] = optimizePart([], path[0], path.slice(1), elements, select, toString)
  if (!endOptimized) {
    path[path.length-1] = optimizePart(path.slice(0, -1), path[path.length-1], [], elements, select, toString)
  }

  if (globalModified) {
    delete global.document
  }

  return path
}

/**
 * Optimize :contains
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
const optimizeContains = (pre, current, post, elements, select, toString) => {
  const [contains, other] = partition(current.pseudo, (item) => /contains\("/.test(item))

  if (contains.length > 0 && post.length) {
    const optimized = [...other, ...contains]
    while (optimized.length > other.length) {
      optimized.pop()
      const pattern = toString.path([...pre, { ...current, pseudo: optimized }, ...post]) // `${prePart}${prefix}${toString.pseudo(optimized)}${postPart}`
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
 * @param  {Array.<Pattern>}     pre  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
const optimizeAttributes = (pre, current, post, elements, select, toString) => {
  // reduce attributes: first try without value, then removing completely
  if (current.attributes.length > 0) {
    let attributes = [...current.attributes]

    const simplify = (original, getSimplified) => {
      let i = original.length - 1
      while (i >= 0) {
        let attributes = getSimplified(original, i)
        if (!compareResults(
          select(toString.path([...pre, { ...current, attributes }, ...post])),
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
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
const optimizeDescendant = (pre, current, post, elements, select, toString) => {
  // robustness: descendant instead child (heuristic)
  if (current.relates === 'child') {
    const descendant = { ...current, relates: undefined }
    let matches = select(toString.path([...pre, descendant, ...post]))
    if (compareResults(matches, elements)) {
      return descendant
    }
  }
  return current
}

/**
 * Optimize nth of type
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
const optimizeNthOfType = (pre, current, post, elements, select, toString) => {
  const i = current.pseudo.findIndex(item => item.startsWith('nth-child'))
  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (i >= 0) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    const type = current.pseudo[i].replace(/^nth-child/, 'nth-of-type')
    const nthOfType = { ...current, pseudo: [...current.pseudo.slice(0, i), type, ...current.pseudo.slice(i + 1)] }
    let pattern = toString.path([...pre, nthOfType, ...post])
    let matches = select(pattern)
    if (compareResults(matches, elements)) {
      return nthOfType
    }
  }
  return current
}

/**
 * Optimize classes
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
const optimizeClasses = (pre, current, post, elements, select, toString) => {
  // efficiency: combinations of classname (partial permutations)
  if (current.classes.length > 1) {
    let optimized = current.classes.slice().sort((curr, next) => curr.length - next.length)

    while (optimized.length > 1) {
      optimized.shift()
      const pattern = toString.path([...pre, { ...current, classes: optimized }, ...post])
      if (!compareResults(select(pattern), elements)) {
        break
      }
      current.classes = optimized
    }

    optimized = current.classes

    if (optimized.length > 2) {
      const base = createPattern({ classes: optimized })
      const references = select(toString.path([...pre, base]))
      for (var i = 0; i < references.length; i++) {
        const reference = references[i]
        if (elements.some((element) => reference.contains(element))) {
          // TODO:
          // - check using attributes + regard excludes
          const description = createPattern({ tagName: reference.tagName })
          var pattern = toString.path([...pre, createPattern({ tagName: reference.tagName }), ...post])
          var matches = select(pattern)
          if (compareResults(matches, elements)) {
            current = description
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
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
const optimizePart = (pre, current, post, elements, select, toString) =>
  optimizers.reduce((acc, optimizer) => optimizer(pre, acc, post, elements, select, toString), current)

/**
 * Evaluate matches with expected elements
 *
 * @param  {Array.<HTMLElement>} matches  - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {Boolean}                      - [description]
 */
export const compareResults = (matches, elements) => {
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
