/**
 * # Adapter
 *
 * Add missing features
 */

/*
 * "for ... of - iteration" polyfill for NodeLists
 * source: https://jakearchibald.com/2014/iterators-gonna-iterate/#nodelist-iteration
 */
if (typeof NodeList !== 'undefined' && !NodeList.prototype[Symbol.iterator]) {
  NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
}
