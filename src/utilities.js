/**
 * # Utilities
 *
 * Convenience helpers.
 */

/**
 * Create an array with the DOM nodes of the list
 *
 * @param  {NodeList}             nodes - [description]
 * @return {Array.<HTMLElement>}        - [description]
 */
export const convertNodeList = (nodes) => {
  const { length } = nodes
  const arr = new Array(length)
  for (var i = 0; i < length; i++) {
    arr[i] = nodes[i]
  }
  return arr
}

/**
 * Escape special characters and line breaks as a simplified version of 'CSS.escape()'
 *
 * Description of valid characters: https://mathiasbynens.be/notes/css-escapes
 *
 * @param  {String?} value - [description]
 * @return {String}        - [description]
 */
export const escapeValue = (value) =>
  value && value.replace(/['"`\\/:?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&')
    .replace(/\n/g, '\u00a0')

/**
 * Partition array into two groups determined by predicate
 */
export const partition = (array, predicate) =>
  array.reduce(
    ([inner, outer], item) => predicate(item) ? [inner.concat(item), outer] : [inner, outer.concat(item)],
    [[], []]
  )
