var libraries = {}


function addLibrary(name, settings) {
  libraries[name] = settings;
}


function runTests() {

  results = {};

  for (key in libraries) {
    var settings = libraries[key];
    results[key] = getResults(settings);
  }

  drawResults(results);
}


function drawResults(results) {
  var wrapper = document.querySelector('#results');
  wrapper.innerHTML = '';

  var output = document.createDocumentFragment()

  var resultsList = Object.keys(results).map(function (key) {
    var result = results[key]
    result.key = key
    return result
  })
  // priority: Valid (v), Longest (^), Duration (^)
  .sort(function(curr, next) {
    return next.validSelectors.length - curr.validSelectors.length ||
           curr.longestSelector.length - next.longestSelector.length ||
           curr.duration - next.duration
  })

  resultsList.forEach(function(data) {
    var row = output.appendChild(document.createElement('tr'));
    addCell(row, data.key);
    addCell(row, data.validSelectors.length);
    addCell(row, data.invalidSelectors.length);
    addCell(row, data.notFoundSelectors);
    addCell(row, data.nonUniqueSelectors.length);
    addCell(row, data.nonMatchingSelectors.length);
    addCell(row, "(" + data.longestSelector.length + ") " + data.longestSelector);
    addCell(row, data.duration + "ms");
  })

  wrapper.appendChild(output);
}

function hasInvalidSelectors (data) {
  return data.invalidSelectors.length || data.notFoundSelectors.length ||
         data.nonUniqueSelectors.length || data.nonMatchingSelectors.length
}

function addCell(row, content) {
  var cell = row.appendChild(document.createElement('td'));
  cell.appendChild(document.createTextNode(content));
  return cell;
}


function getResults(settings) {

  var elements = document.querySelector('#wrap').querySelectorAll('*');

  var result = {
    duration: -1,
    validSelectors: [],
    invalidSelectors: [],
    nonUniqueSelectors: [],
    nonMatchingSelectors: [],
    notFoundSelectors: 0,
    longestSelector: '',
    outputs: [],
  };
  var outputs = [];

  var timeStart = (new Date).getTime();

  for (var i = 0, j = elements.length; i < j; i++) {
    var element = elements[i];
    var selector = settings.generate(element);
    outputs.push({
      element: element,
      selector: selector
    });
  }

  var timeEnd = (new Date).getTime();
  result.duration = timeEnd - timeStart

  for (i = 0, j = outputs.length; i < j; i++) {
    var output = outputs[i];
    var selector = output.selector;
    var element = output.element;

    if (selector) {

      var foundElements = []

      try {
        foundElements = settings.check(selector);
      } catch (e) {
        result.invalidSelectors.push(selector);
        output.invalidSelector = true;
      }

      if (foundElements.length > 1) {
        result.nonUniqueSelectors.push(selector);
        output.nonUniqueSelector = true;
      } else {
        if (foundElements[0] === element) {
          result.validSelectors.push(selector);
          output.validSelector = true;
        } else {
          result.nonMatchingSelectors.push(selector);
          output.nonMatchingSelector = true;
        }
      }

      if (selector.length > result.longestSelector.length) {
        result.longestSelector = selector;
      }

    } else {
      result.notFoundSelectors++;
      output.notFoundSelector = true;
    }

  }

  result.outputs = outputs;

  return result;
}
