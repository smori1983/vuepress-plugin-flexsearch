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

module.exports.create = create;
