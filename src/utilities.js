/**
 * # Utilities
 *
 * Convenience helpers
 */

/**
 * Create an array with the DOM nodes of the list
 *
 * @param  {NodeList}             nodes - [description]
 * @return {Array.<HTMLElement>}        - [description]
 */
export function convertNodeList (nodes) {
  const { length } = nodes
  const arr = new Array(length)
  for (var i = 0; i < length; i++) {
    arr[i] = nodes[i]
  }
  return arr
}

/**
 * Escape special characters like quotes and backslashes
 *
 * Description of valid characters: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#Notes
 *
 * @param  {String?} value - [description]
 * @return {String}        - [description]
 */
export function escapeValue (value) {
  return value && value.replace(/['"`\\/:\?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&')
}
