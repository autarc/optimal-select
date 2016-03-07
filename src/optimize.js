/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
 */

/**
 * Apply different optimization techniques
 * @param  {String}      selector - [description]
 * @param  {HTMLElement} element  - [description]
 * @return {String}               - [description]
 */
export default function optimize (selector, element) {

  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729)
  var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/)

  if (path.length < 3) {
    return selector
  }

  const shortened = [path.pop()]
  while (path.length > 1)  {
    const current = path.pop()
    const prePart = path.join(' ')
    const postPart = shortened.join(' ')

    const pattern = `${prePart} ${postPart}`
    const matches = document.querySelectorAll(pattern)
    if (matches.length !== 1) {
      shortened.unshift(optimizePart(prePart, current, postPart, element))
    }
  }
  shortened.unshift(path[0])
  path = shortened

  // optimize start + end
  path[0] = optimizePart('', path[0], path.slice(1).join(' '), element)
  path[path.length-1] = optimizePart(path.slice(0, -1).join(' '), path[path.length-1], '', element)

  return path.join(' ').replace(/>/g, '> ').trim()
}

/**
 * Improve a chunk of the selector
 * @param  {String}      prePart  - [description]
 * @param  {String}      current  - [description]
 * @param  {String}      postPart - [description]
 * @param  {HTMLElement} element  - [description]
 * @return {String}               - [description]
 */
function optimizePart (prePart, current, postPart, element) {
  if (prePart.length) prePart = `${prePart} `
  if (postPart.length) postPart = ` ${postPart}`

  // robustness: attribute without value (generalization)
  if (/\[*\]/.test(current)) {
    const key = current.replace(/=.*$/, ']')
    var pattern = `${prePart}${key}${postPart}`
    var matches = document.querySelectorAll(pattern)
    if (matches.length === 1 && matches[0] === element) {
      current = key
    } else {
      // robustness: replace specific key-value with tag (heuristic)
      const references = document.querySelectorAll(`${prePart}${key}`)
      for (var i = 0, l = references.length; i < l; i++) {
        if (references[i].contains(element)) {
          const description = references[i].tagName.toLowerCase()
          var pattern = `${prePart}${description}${postPart}`
          var matches = document.querySelectorAll(pattern)
          if (matches.length === 1 && matches[0] === element) {
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
    if (matches.length === 1 && matches[0] === element) {
      current = descendant
    }
  }

  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (/\:nth-child/.test(current)) {
    const type = current.replace(/nth-child/g, 'nth-of-type')
    var pattern = `${prePart}${type}${postPart}`
    var matches = document.querySelectorAll(pattern)
    if (matches.length === 1 && matches[0] === element) {
      current = type
    }
  }

  // efficiency: combinations of classname (partial permutations)
  if (/\.\S+\.\S+/.test(current)) {
    const names = current.trim().split('.').slice(1).map((name) => `.${name}`)
                                .sort((curr, next) => curr.length - next.length)
    while (names.length) {
      var partial = current.replace(names.shift(), '')
      var pattern = `${prePart}${partial}${postPart}`
      var matches = document.querySelectorAll(pattern)
      if (matches.length === 1 && matches[0] === element) {
        current = partial
      }
    }
    // robustness: degrade complex classname (heuristic)
    if (current && current.match(/\./g).length > 2) {
      const references = document.querySelectorAll(`${prePart}${current}`)
      for (var i = 0, l = references.length; i < l; i++) {
        if (references[i].contains(element)) {
          // TODO:
          // - check using attributes + regard excludes
          const description = references[i].tagName.toLowerCase()
          var pattern = `${prePart}${description}${postPart}`
          var matches = document.querySelectorAll(pattern)
          if (matches.length === 1 && matches[0] === element) {
            current = description
          }
          break
        }
      }
    }
  }

  return current
}
