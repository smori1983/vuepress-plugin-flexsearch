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

module.exports.create = create;
