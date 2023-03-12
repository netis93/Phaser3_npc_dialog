var getIndicesOf = function(searchStr, str) {
  var searchStrLen = searchStr.length;
  if (searchStrLen === 0) {
    return [];
  }
  var startIndex = 0,
    index,
    indices = [];

  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
};

var specialCharactersFill = function(start, end) {
  const fillRange = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((item, index) => start + index);
  };

  return fillRange(start, end);
};

var createSpecialCharactersIndexList = function(text) {
  var firstBracesList = getIndicesOf("{", text);
  var secondBracesList = getIndicesOf("}", text);
  var specialTextIndexs = [];
  for (let b = 0; b < firstBracesList.length; b++) {
    let numberOfRemovedBraces = b === 0 ? 0 : 2 * (b + 1) - 1;
    let indexOne = firstBracesList[b] - numberOfRemovedBraces;
    let indexTwo = secondBracesList[b] - 2 * (b + 1);
    let indexes = specialCharactersFill(indexOne, indexTwo);

    specialTextIndexs.push(...indexes);
  }

  return specialTextIndexs;
};

module.exports = createSpecialCharactersIndexList;
