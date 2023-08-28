const TextProcessing = require('./text-processing');

/**
 * @param {string} text
 * @param {number} size
 * @return {string[]}
 */
const create = (text, size) => {
  const result = [];

  for (let i = 0, len = text.length; i < len; i++) {
    result.push(text.slice(i, i + size));
  }

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
