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
export function convertNodeList(nodes) {
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
export function escapeValue(value) {

  if (CSS.escape) {
    return value && CSS.escape(value);
  }

  return value && value.replace(/['"`\\/:\?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&')
    .replace(/\n/g, '\A')
}
