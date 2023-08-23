const TextProcessing = require('./text-processing');

/**
 * @param {string} text
 * @param {number} size
 * @return {string[]}
 */
const create = (text, size) => {
  const result = [];

  let i = 0;

  do {
    result.push(text.slice(i, i + size));
    i++;
  } while (i + size <= text.length);

  return result;
};

/**
 * @param {string} text
 * @param {number} size
 * @return {string[]}
 */
const createForSearch = (text, size) => {
  const textProcessing = new TextProcessing();

  textProcessing.add(text);

  return textProcessing.getResult()
    .map(text => create(text, size).join(' '));
};

module.exports.create = create;
module.exports.createForSearch = createForSearch;
