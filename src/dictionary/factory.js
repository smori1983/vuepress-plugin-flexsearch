const Manager = require('./manager');

/**
 * @param {string[][]} dictionarySet
 * @return {Manager}
 */
const createFromDictionarySet = (dictionarySet) => {
  return new Manager(createDictionaryMap(dictionarySet));
};

/**
 * @param {Object.<string, string[]>} moduleData
 * @return {Manager}
 */
const createFromClientDynamicModule = (moduleData) => {
  /** @type {Map<string, Set<string>>} */
  const map = new Map();

  Object.keys(moduleData).forEach((key) => {
    map.set(key, new Set(moduleData[key]));
  });

  return new Manager(map);
};

/**
 * @param {string[][]} dictionarySet
 * @return {Map<string, Set<string>>}
 */
const createDictionaryMap = (dictionarySet) => {
  const dictionaryMap = initDictionaryMap(dictionarySet);

  dictionarySet.forEach((dictionaryItem) => {
    for (let i = 0; i < dictionaryItem.length; i++) {
      for (let j = 0; j < dictionaryItem.length; j++) {
        if (i !== j) {
          dictionaryMap.get(dictionaryItem[i]).add(dictionaryItem[j]);
        }
      }
    }
  });

  return dictionaryMap;
};

/**
 * @param {string[][]} dictionarySet
 * @return {Map<string, Set<string>>}
 */
const initDictionaryMap = (dictionarySet) => {
  /** @type {Map<string, Set<string>>} */
  const dictionaryMap = new Map();

  /** @type {Set<string>} */
  const words = new Set();

  dictionarySet.forEach((dictionaryItem) => {
    dictionaryItem.forEach((word) => {
      words.add(word);
    });
  });

  Array.from(words).forEach((word) => {
    dictionaryMap.set(word, new Set());
  });

  return dictionaryMap;
};

module.exports.createFromDictionarySet = createFromDictionarySet;
module.exports.createFromClientDynamicModule = createFromClientDynamicModule;
