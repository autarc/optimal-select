'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optimize;
/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector tranformation
 */

/**
 * Apply different optimization techniques
 * @param  {String}      selector - [description]
 * @param  {HTMLElement} element  - [description]
 * @return {String}               - [description]
 */
function optimize(selector, element) {
  var path = selector.replace(/> /g, '>').split(' ');

  if (path.length < 3) {
    return selector;
  }

  var shortened = [path.pop()];
  while (path.length > 1) {
    var current = path.pop();
    var prePart = path.join(' ');
    var postPart = shortened.join(' ');

    var pattern = prePart + ' ' + postPart;
    var matches = document.querySelectorAll(pattern);
    if (matches.length !== 1) {
      shortened.unshift(optimizePart(prePart, current, postPart, element));
    }
  }
  shortened.unshift(path[0]);
  path = shortened;

  // optimize start + end
  path[0] = optimizePart('', path[0], path.slice(1).join(' '), element);
  path[path.length - 1] = optimizePart(path.slice(0, -1).join(' '), path[path.length - 1], '', element);

  return path.join(' ').replace(/>/g, '> ').trim();
}

/**
 * Improve a chunk of the selector
 * @param  {String}      prePart  - [description]
 * @param  {String}      current  - [description]
 * @param  {String}      postPart - [description]
 * @param  {HTMLElement} element  - [description]
 * @return {String}               - [description]
 */
function optimizePart(prePart, current, postPart, element) {
  if (prePart.length) prePart = prePart + ' ';
  if (postPart.length) postPart = ' ' + postPart;

  // robustness: attribute without value (generalization)
  if (/\[*\]/.test(current)) {
    var key = current.replace(/=.*$/, ']');
    var pattern = '' + prePart + key + postPart;
    var matches = document.querySelectorAll(pattern);
    if (matches.length === 1 && matches[0] === element) {
      current = key;
    } else {
      // robustness: replace specific key-value with tag (heuristic)
      var references = document.querySelectorAll('' + prePart + key);
      for (var i = 0, l = references.length; i < l; i++) {
        if (references[i].contains(element)) {
          var description = references[i].tagName.toLowerCase();
          var pattern = '' + prePart + description + postPart;
          var matches = document.querySelectorAll(pattern);
          if (matches.length === 1 && matches[0] === element) {
            current = description;
          }
          break;
        }
      }
    }
  }

  // robustness: descendant instead child (heuristic)
  if (/>/.test(current)) {
    var descendant = current.replace(/>/, '');
    var pattern = '' + prePart + descendant + postPart;
    var matches = document.querySelectorAll(pattern);
    if (matches.length === 1 && matches[0] === element) {
      current = descendant;
    }
  }

  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (/\:nth-child/.test(current)) {
    var type = current.replace(/nth-child/g, 'nth-of-type');
    var pattern = '' + prePart + type + postPart;
    var matches = document.querySelectorAll(pattern);
    if (matches.length === 1 && matches[0] === element) {
      current = type;
    }
  }

  // efficiency: combinations of classname (partial permutations)
  if (/\.\S+\.\S+/.test(current)) {
    var names = current.trim().split('.').slice(1).map(function (name) {
      return '.' + name;
    }).sort(function (curr, next) {
      return curr.length - next.length;
    });
    while (names.length) {
      var partial = current.replace(names.shift(), '');
      var pattern = '' + prePart + partial + postPart;
      var matches = document.querySelectorAll(pattern);
      if (matches.length === 1 && matches[0] === element) {
        current = partial;
      }
    }
    // robustness: degrade complex classname (heuristic)
    if (current && current.match(/\./g).length > 2) {
      var references = document.querySelectorAll('' + prePart + current);
      for (var i = 0, l = references.length; i < l; i++) {
        if (references[i].contains(element)) {
          // TODO:
          // - check using attributes + regard excludes
          var description = references[i].tagName.toLowerCase();
          var pattern = '' + prePart + description + postPart;
          var matches = document.querySelectorAll(pattern);
          if (matches.length === 1 && matches[0] === element) {
            current = description;
          }
          break;
        }
      }
    }
  }

  return current;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUtuQyxjQUFJLFVBQVUsU0FBUyxnQkFBVCxDQUEwQixPQUExQixDQUFWLENBTCtCO0FBTW5DLGNBQUksUUFBUSxNQUFSLEtBQW1CLENBQW5CLElBQXdCLFFBQVEsQ0FBUixNQUFlLE9BQWYsRUFBd0I7QUFDbEQsc0JBQVUsV0FBVixDQURrRDtXQUFwRDtBQUdBLGdCQVRtQztTQUFyQztPQURGO0tBRkY7R0FaRjs7QUE4QkEsU0FBTyxPQUFQLENBL0UwRDtDQUE1RCIsImZpbGUiOiJvcHRpbWl6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBPcHRpbWl6ZVxuICpcbiAqIDEuKSBJbXByb3ZlIGVmZmljaWVuY3kgdGhyb3VnaCBzaG9ydGVyIHNlbGVjdG9ycyBieSByZW1vdmluZyByZWR1bmRhbmN5XG4gKiAyLikgSW1wcm92ZSByb2J1c3RuZXNzIHRocm91Z2ggc2VsZWN0b3IgdHJhbmZvcm1hdGlvblxuICovXG5cbi8qKlxuICogQXBwbHkgZGlmZmVyZW50IG9wdGltaXphdGlvbiB0ZWNobmlxdWVzXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgc2VsZWN0b3IgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplIChzZWxlY3RvciwgZWxlbWVudCkge1xuICB2YXIgcGF0aCA9IHNlbGVjdG9yLnJlcGxhY2UoLz4gL2csICc+Jykuc3BsaXQoJyAnKVxuXG4gIGlmIChwYXRoLmxlbmd0aCA8IDMpIHtcbiAgICByZXR1cm4gc2VsZWN0b3JcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lZCA9IFtwYXRoLnBvcCgpXVxuICB3aGlsZSAocGF0aC5sZW5ndGggPiAxKSAge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXRoLnBvcCgpXG4gICAgY29uc3QgcHJlUGFydCA9IHBhdGguam9pbignICcpXG4gICAgY29uc3QgcG9zdFBhcnQgPSBzaG9ydGVuZWQuam9pbignICcpXG5cbiAgICBjb25zdCBwYXR0ZXJuID0gYCR7cHJlUGFydH0gJHtwb3N0UGFydH1gXG4gICAgY29uc3QgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHNob3J0ZW5lZC51bnNoaWZ0KG9wdGltaXplUGFydChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudCkpXG4gICAgfVxuICB9XG4gIHNob3J0ZW5lZC51bnNoaWZ0KHBhdGhbMF0pXG4gIHBhdGggPSBzaG9ydGVuZWRcblxuICAvLyBvcHRpbWl6ZSBzdGFydCArIGVuZFxuICBwYXRoWzBdID0gb3B0aW1pemVQYXJ0KCcnLCBwYXRoWzBdLCBwYXRoLnNsaWNlKDEpLmpvaW4oJyAnKSwgZWxlbWVudClcbiAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoLnNsaWNlKDAsIC0xKS5qb2luKCcgJyksIHBhdGhbcGF0aC5sZW5ndGgtMV0sICcnLCBlbGVtZW50KVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKS5yZXBsYWNlKC8+L2csICc+ICcpLnRyaW0oKVxufVxuXG4vKipcbiAqIEltcHJvdmUgYSBjaHVuayBvZiB0aGUgc2VsZWN0b3JcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVQYXJ0IChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudCkge1xuICBpZiAocHJlUGFydC5sZW5ndGgpIHByZVBhcnQgPSBgJHtwcmVQYXJ0fSBgXG4gIGlmIChwb3N0UGFydC5sZW5ndGgpIHBvc3RQYXJ0ID0gYCAke3Bvc3RQYXJ0fWBcblxuICAvLyByb2J1c3RuZXNzOiBhdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZSAoZ2VuZXJhbGl6YXRpb24pXG4gIGlmICgvXFxbKlxcXS8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGtleSA9IGN1cnJlbnQucmVwbGFjZSgvPS4qJC8sICddJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtrZXl9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBrZXlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcm9idXN0bmVzczogcmVwbGFjZSBzcGVjaWZpYyBrZXktdmFsdWUgd2l0aCB0YWcgKGhldXJpc3RpYylcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3ByZVBhcnR9JHtrZXl9YClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHJlZmVyZW5jZXNbaV0uY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZXNbaV0udGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogZGVzY2VuZGFudCBpbnN0ZWFkIGNoaWxkIChoZXVyaXN0aWMpXG4gIGlmICgvPi8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSBjdXJyZW50LnJlcGxhY2UoLz4vLCAnJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjZW5kYW50fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSBlbGVtZW50KSB7XG4gICAgICBjdXJyZW50ID0gZGVzY2VuZGFudFxuICAgIH1cbiAgfVxuXG4gIC8vIHJvYnVzdG5lc3M6ICdudGgtb2YtdHlwZScgaW5zdGVhZCAnbnRoLWNoaWxkJyAoaGV1cmlzdGljKVxuICBpZiAoL1xcOm50aC1jaGlsZC8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IHR5cGUgPSBjdXJyZW50LnJlcGxhY2UoL250aC1jaGlsZC9nLCAnbnRoLW9mLXR5cGUnKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke3R5cGV9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgIGN1cnJlbnQgPSB0eXBlXG4gICAgfVxuICB9XG5cbiAgLy8gZWZmaWNpZW5jeTogY29tYmluYXRpb25zIG9mIGNsYXNzbmFtZSAocGFydGlhbCBwZXJtdXRhdGlvbnMpXG4gIGlmICgvXFwuXFxTK1xcLlxcUysvLnRlc3QoY3VycmVudCkpIHtcbiAgICBjb25zdCBuYW1lcyA9IGN1cnJlbnQudHJpbSgpLnNwbGl0KCcuJykuc2xpY2UoMSkubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcbiAgICB3aGlsZSAobmFtZXMubGVuZ3RoKSB7XG4gICAgICB2YXIgcGFydGlhbCA9IGN1cnJlbnQucmVwbGFjZShuYW1lcy5zaGlmdCgpLCAnJylcbiAgICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke3BhcnRpYWx9JHtwb3N0UGFydH1gXG4gICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSBlbGVtZW50KSB7XG4gICAgICAgIGN1cnJlbnQgPSBwYXJ0aWFsXG4gICAgICB9XG4gICAgfVxuICAgIC8vIHJvYnVzdG5lc3M6IGRlZ3JhZGUgY29tcGxleCBjbGFzc25hbWUgKGhldXJpc3RpYylcbiAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50Lm1hdGNoKC9cXC4vZykubGVuZ3RoID4gMikge1xuICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7cHJlUGFydH0ke2N1cnJlbnR9YClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHJlZmVyZW5jZXNbaV0uY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAvLyBUT0RPOlxuICAgICAgICAgIC8vIC0gY2hlY2sgdXNpbmcgYXR0cmlidXRlcyArIHJlZ2FyZCBleGNsdWRlc1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlc1tpXS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjcmlwdGlvbn0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudFxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
