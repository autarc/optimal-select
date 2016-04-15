'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optimize;

var _adapt = require('./adapt');

var _adapt2 = _interopRequireDefault(_adapt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply different optimization techniques
 * @param  {string}      selector - [description]
 * @param  {HTMLElement} element  - [description]
 * @return {string}               - [description]
 */
function optimize(selector, element) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];


  var globalModified = (0, _adapt2.default)(element, options);

  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729)
  var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/);

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

  if (globalModified) {
    delete global.document;
  }

  return path.join(' ').replace(/>/g, '> ').trim();
}

/**
 * Improve a chunk of the selector
 * @param  {string}      prePart  - [description]
 * @param  {string}      current  - [description]
 * @param  {string}      postPart - [description]
 * @param  {HTMLElement} element  - [description]
 * @return {string}               - [description]
 */
/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
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
  if (/:nth-child/.test(current)) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
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
      var _references = document.querySelectorAll('' + prePart + current);
      for (var i = 0, l = _references.length; i < l; i++) {
        if (_references[i].contains(element)) {
          // TODO:
          // - check using attributes + regard excludes
          var _description = _references[i].tagName.toLowerCase();
          var pattern = '' + prePart + _description + postPart;
          var matches = document.querySelectorAll(pattern);
          if (matches.length === 1 && matches[0] === element) {
            current = _description;
          }
          break;
        }
      }
    }
  }

  return current;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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YyxRQUFkLENBQXVCLE9BQXZCLENBQUosRUFBcUM7OztBQUduQyxjQUFNLGVBQWMsWUFBVyxDQUFYLEVBQWMsT0FBZCxDQUFzQixXQUF0QixFQUFkLENBSDZCO0FBSW5DLGNBQUksZUFBYSxVQUFVLGVBQWMsUUFBckMsQ0FKK0I7QUFLbkMsY0FBSSxVQUFVLFNBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsQ0FBVixDQUwrQjtBQU1uQyxjQUFJLFFBQVEsTUFBUixLQUFtQixDQUFuQixJQUF3QixRQUFRLENBQVIsTUFBZSxPQUFmLEVBQXdCO0FBQ2xELHNCQUFVLFlBQVYsQ0FEa0Q7V0FBcEQ7QUFHQSxnQkFUbUM7U0FBckM7T0FERjtLQUZGO0dBWkY7O0FBOEJBLFNBQU8sT0FBUCxDQWhGMEQ7Q0FBNUQiLCJmaWxlIjoib3B0aW1pemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgT3B0aW1pemVcbiAqXG4gKiAxLikgSW1wcm92ZSBlZmZpY2llbmN5IHRocm91Z2ggc2hvcnRlciBzZWxlY3RvcnMgYnkgcmVtb3ZpbmcgcmVkdW5kYW5jeVxuICogMi4pIEltcHJvdmUgcm9idXN0bmVzcyB0aHJvdWdoIHNlbGVjdG9yIHRyYW5zZm9ybWF0aW9uXG4gKi9cblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5cbi8qKlxuICogQXBwbHkgZGlmZmVyZW50IG9wdGltaXphdGlvbiB0ZWNobmlxdWVzXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgc2VsZWN0b3IgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplIChzZWxlY3RvciwgZWxlbWVudCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGNodW5rIHBhcnRzIG91dHNpZGUgb2YgcXVvdGVzIChodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTY2MzcyOSlcbiAgdmFyIHBhdGggPSBzZWxlY3Rvci5yZXBsYWNlKC8+IC9nLCAnPicpLnNwbGl0KC9cXHMrKD89KD86KD86W15cIl0qXCIpezJ9KSpbXlwiXSokKS8pXG5cbiAgaWYgKHBhdGgubGVuZ3RoIDwgMykge1xuICAgIHJldHVybiBzZWxlY3RvclxuICB9XG5cbiAgY29uc3Qgc2hvcnRlbmVkID0gW3BhdGgucG9wKCldXG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpICB7XG4gICAgY29uc3QgY3VycmVudCA9IHBhdGgucG9wKClcbiAgICBjb25zdCBwcmVQYXJ0ID0gcGF0aC5qb2luKCcgJylcbiAgICBjb25zdCBwb3N0UGFydCA9IHNob3J0ZW5lZC5qb2luKCcgJylcblxuICAgIGNvbnN0IHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSAke3Bvc3RQYXJ0fWBcbiAgICBjb25zdCBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgc2hvcnRlbmVkLnVuc2hpZnQob3B0aW1pemVQYXJ0KHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50KSlcbiAgICB9XG4gIH1cbiAgc2hvcnRlbmVkLnVuc2hpZnQocGF0aFswXSlcbiAgcGF0aCA9IHNob3J0ZW5lZFxuXG4gIC8vIG9wdGltaXplIHN0YXJ0ICsgZW5kXG4gIHBhdGhbMF0gPSBvcHRpbWl6ZVBhcnQoJycsIHBhdGhbMF0sIHBhdGguc2xpY2UoMSkuam9pbignICcpLCBlbGVtZW50KVxuICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGguc2xpY2UoMCwgLTEpLmpvaW4oJyAnKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgJycsIGVsZW1lbnQpXG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpLnJlcGxhY2UoLz4vZywgJz4gJykudHJpbSgpXG59XG5cbi8qKlxuICogSW1wcm92ZSBhIGNodW5rIG9mIHRoZSBzZWxlY3RvclxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZVBhcnQgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50KSB7XG4gIGlmIChwcmVQYXJ0Lmxlbmd0aCkgcHJlUGFydCA9IGAke3ByZVBhcnR9IGBcbiAgaWYgKHBvc3RQYXJ0Lmxlbmd0aCkgcG9zdFBhcnQgPSBgICR7cG9zdFBhcnR9YFxuXG4gIC8vIHJvYnVzdG5lc3M6IGF0dHJpYnV0ZSB3aXRob3V0IHZhbHVlIChnZW5lcmFsaXphdGlvbilcbiAgaWYgKC9cXFsqXFxdLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3Qga2V5ID0gY3VycmVudC5yZXBsYWNlKC89LiokLywgJ10nKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2tleX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gZWxlbWVudCkge1xuICAgICAgY3VycmVudCA9IGtleVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByb2J1c3RuZXNzOiByZXBsYWNlIHNwZWNpZmljIGtleS12YWx1ZSB3aXRoIHRhZyAoaGV1cmlzdGljKVxuICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7cHJlUGFydH0ke2tleX1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAocmVmZXJlbmNlc1tpXS5jb250YWlucyhlbGVtZW50KSkge1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlc1tpXS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjcmlwdGlvbn0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiBkZXNjZW5kYW50IGluc3RlYWQgY2hpbGQgKGhldXJpc3RpYylcbiAgaWYgKC8+Ly50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IGN1cnJlbnQucmVwbGFjZSgvPi8sICcnKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NlbmRhbnR9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBkZXNjZW5kYW50XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogJ250aC1vZi10eXBlJyBpbnN0ZWFkICdudGgtY2hpbGQnIChoZXVyaXN0aWMpXG4gIGlmICgvOm50aC1jaGlsZC8udGVzdChjdXJyZW50KSkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIGNvbXBsZXRlIGNvdmVyYWdlIG9mICdudGgtb2YtdHlwZScgcmVwbGFjZW1lbnRcbiAgICBjb25zdCB0eXBlID0gY3VycmVudC5yZXBsYWNlKC9udGgtY2hpbGQvZywgJ250aC1vZi10eXBlJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHt0eXBlfSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSBlbGVtZW50KSB7XG4gICAgICBjdXJyZW50ID0gdHlwZVxuICAgIH1cbiAgfVxuXG4gIC8vIGVmZmljaWVuY3k6IGNvbWJpbmF0aW9ucyBvZiBjbGFzc25hbWUgKHBhcnRpYWwgcGVybXV0YXRpb25zKVxuICBpZiAoL1xcLlxcUytcXC5cXFMrLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3QgbmFtZXMgPSBjdXJyZW50LnRyaW0oKS5zcGxpdCgnLicpLnNsaWNlKDEpLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG4gICAgd2hpbGUgKG5hbWVzLmxlbmd0aCkge1xuICAgICAgdmFyIHBhcnRpYWwgPSBjdXJyZW50LnJlcGxhY2UobmFtZXMuc2hpZnQoKSwgJycpXG4gICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtwYXJ0aWFsfSR7cG9zdFBhcnR9YFxuICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gZWxlbWVudCkge1xuICAgICAgICBjdXJyZW50ID0gcGFydGlhbFxuICAgICAgfVxuICAgIH1cbiAgICAvLyByb2J1c3RuZXNzOiBkZWdyYWRlIGNvbXBsZXggY2xhc3NuYW1lIChoZXVyaXN0aWMpXG4gICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC5tYXRjaCgvXFwuL2cpLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3ByZVBhcnR9JHtjdXJyZW50fWApXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZmVyZW5jZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChyZWZlcmVuY2VzW2ldLmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAvLyAtIGNoZWNrIHVzaW5nIGF0dHJpYnV0ZXMgKyByZWdhcmQgZXhjbHVkZXNcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZXNbaV0udGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
