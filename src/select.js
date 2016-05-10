/**
 * # Select
 *
 * Construct a unique CSS queryselector to access the selected DOM element(s).
 * Applies different matching and optimization strategies for efficiency.
 */

import adapt from './adapt'
import match from './match'
import optimize from './optimize'

/**
 * Choose action depending on the input (single/multi)
 * @param  {HTMLElement|Array} input   - [description]
 * @param  {Object}            options - [description]
 * @return {string}                    - [description]
 */
export default function getQuerySelector (input, options = {}) {
  if (Array.isArray(input)) {
    return getMultiSelector(input, options)
  }
  return getSingleSelector(input, options)
}

/**
 * Get a selector for the provided element
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      options - [description]
 * @return {String}              - [description]
 */
export function getSingleSelector (element, options) {

  if (element.nodeType === 3) {
    return getSingleSelector(element.parentNode)
  }
  if (element.nodeType !== 1) {
    throw new Error(`Invalid input - only HTMLElements or representations of them are supported! (not "${typeof element}")`)
  }

  const globalModified = adapt(element, options)

  const selector = match(element, options)
  const optimized = optimize(selector, element, options)

  // debug
  // console.log(`
  //   selector: ${selector}
  //   optimized:${optimized}
  // `)

  if (globalModified) {
    delete global.document
  }

  return optimized
}

/**
 * Get a selector to match multiple children from a parent
 * @param  {Array}  elements - [description]
 * @param  {Object} options  - [description]
 * @return {string}          - [description]
 */
export function getMultiSelector (elements, options) {
  const firstEl = elements[0];
  let commonClassName = firstEl.className;
  let commonTagName = firstEl.tagName;
  let candidate;

  const getParentNodes = function(el) {
    const nodes = [];
    while(el.parentNode && el.parentNode !== document.body) {
      el = el.parentNode;
      nodes.push(el);
    }
    return nodes;
  }

  const findSimilarParents = function(props1, props2) {
    const similar = [];
    let i, j;
    for (i = 0; i < props1.length; i++) {
      node1 = props1[i];
      for (j = 0; j < props2.length; j++) {
        node2 = props2[j];
        if (node1 === node2 || (node1.tagName === node2.tagName && node1.className === node2.className)) {
          similar.push(node1);
          similar.concat(findSimilarParents(props1.slice(i), props2.slice(j)));
          return similar;
        }
      }
    }
    return similar;
  }


  let commonParentNodes = getParentNodes(firstEl);

  for (var i = 1; i < elements.length; i++) {
    const candidate = elements[i];
    commonParentNodes = (commonParentNodes, getParentNodes(candidate));
    console.log(commonParentNodes);

    if (candidate.className !== commonClassName) {
      let classNames = [];

      let longer, shorter
      if (candidate.className.length > commonClassName.length) {
        longer = candidate.className
        shorter = commonClassName
      } else {
        longer = commonClassName
        shorter = candidate.className
      }
      shorter.split(' ').forEach((name) => {
        if (longer.indexOf(name) > -1) {
          classNames.push(name)
        }
      })
      commonClassName = classNames.join(' ')
    }

    if (candidate.tagName !== commonTagName) {
      commonTagName = null
    }
  }

  let selectors = [];
  if (commonParentNodes) {
    const parentSelectors = commonParentNodes.map(el => {
      let selector = el.tagName;
      if (el.id !== '') {
        selector += '#' + el.id;
      } else if (el.className !== '') {
        selector += '.' + el.className;
      }
      return selector + ' ';
    });
    parentSelectors.reverse();

    // lets attempt to make the selector shorter
    const originalCount = document.querySelectorAll(parentSelectors.join(' ')).length;
    while(parentSelectors.length > 2) {
      const candidateForRemoval = parentSelectors.shift();
      const newCount = document.querySelectorAll(parentSelectors.join(' ')).length;
      if (newCount !== originalCount) {
        parentSelectors.unshift(candidateForRemoval);
        break;
      }
    }
    selectors.push(parentSelectors.join(' ') + ' ');
  }
  if (commonTagName) {
    selectors.push(`${commonTagName.toLowerCase()}`);
  }
  if (commonClassName) {
    selectors.push(`.${commonClassName.replace(/ /g, '.')}`);
  }
  if (selectors.length === 0) {
    selectors = elements.map(e => getSingleSelector(e, options));
    console.log(selectors.join(','), commonClassName, commonTagName);
    return selectors.join(',');
  } else {
    console.log(selectors.join(''), commonClassName, commonTagName);
    return selectors.join('');
  }
}
