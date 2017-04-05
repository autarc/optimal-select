/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
 */

import adapt from './adapt'
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

  // convert single entry and NodeList
  if (!Array.isArray(elements)) {
    elements = !elements.length ? [elements] : convertNodeList(elements)
  }

  if (!elements.length || elements.some((element) => element.nodeType !== 1)) {
    throw new Error(`Invalid input - to compare HTMLElements its necessary to provide a reference of the selected node(s)! (missing "elements")`)
  }

  const globalModified = adapt(elements[0], options)

  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729)
  var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/)

  if (path.length < 2) {
    return optimizePart('', selector, '', elements)
  }

  const shortened = [path.pop()]
  while (path.length > 1)  {
    const current = path.pop()
    const prePart = path.join(' ')
    const postPart = shortened.join(' ')

    const pattern = `${prePart} ${postPart}`
    const matches = document.querySelectorAll(pattern)
    if (matches.length !== elements.length) {
      shortened.unshift(optimizePart(prePart, current, postPart, elements))
    }
  }
  shortened.unshift(path[0])
  path = shortened

  // optimize start + end
  path[0] = optimizePart('', path[0], path.slice(1).join(' '), elements)
  path[path.length-1] = optimizePart(path.slice(0, -1).join(' '), path[path.length-1], '', elements)

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
 * @return {string}                       - [description]
 */
function optimizePart (prePart, current, postPart, elements) {
  if (prePart.length) prePart = `${prePart} `
  if (postPart.length) postPart = ` ${postPart}`

  // robustness: attribute without value (generalization)
  if (/\[*\]/.test(current)) {
    const key = current.replace(/=.*$/, ']')
    var pattern = `${prePart}${key}${postPart}`
    var matches = document.querySelectorAll(pattern)
    if (compareResults(matches, elements)) {
      current = key
    } else {
      // robustness: replace specific key-value with base tag (heuristic)
      const references = document.querySelectorAll(`${prePart}${key}`)
      for (var i = 0, l = references.length; i < l; i++) {
        const reference = references[i]
        if (elements.some((element) => reference.contains(element))) {
          const description = reference.tagName.toLowerCase()
          var pattern = `${prePart}${description}${postPart}`
          var matches = document.querySelectorAll(pattern)
          if (compareResults(matches, elements)) {
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
    var pattern = `${prePart}${descendant}${postPart}`
    var matches = document.querySelectorAll(pattern)
    if (compareResults(matches, elements)) {
      current = descendant
    }
  }

  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (/:nth-child/.test(current)) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    const type = current.replace(/nth-child/g, 'nth-of-type')
    var pattern = `${prePart}${type}${postPart}`
    var matches = document.querySelectorAll(pattern)
    if (compareResults(matches, elements)) {
      current = type
    }
  }

  // efficiency: combinations of classname (partial permutations)
  if (/\.\S+\.\S+/.test(current)) {
    var names = current.trim().split('.').slice(1)
                                         .map((name) => `.${name}`)
                                         .sort((curr, next) => curr.length - next.length)
    while (names.length) {
      const partial = current.replace(names.shift(), '').trim()
      if(partial.charAt(0) === '>' || partial.charAt(partial.length-1) === '>') {
        break
      }
      var pattern = `${prePart}${partial}${postPart}`.trim()
      if (!pattern.length || pattern.charAt(0) === '>' || pattern.charAt(pattern.length-1) === '>') {
        break
      }
      var matches = document.querySelectorAll(pattern)
      if (compareResults(matches, elements)) {
        current = partial
      }
    }

    // robustness: degrade complex classname (heuristic)
    names = current && current.match(/\./g)
    if (names && names.length > 2) {
      const references = document.querySelectorAll(`${prePart}${current}`)
      for (var i = 0, l = references.length; i < l; i++) {
        const reference = references[i]
        if (elements.some((element) => reference.contains(element) )) {
          // TODO:
          // - check using attributes + regard excludes
          const description = reference.tagName.toLowerCase()
          var pattern = `${prePart}${description}${postPart}`
          var matches = document.querySelectorAll(pattern)
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
