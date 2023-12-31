class Manager {
  /**
   * @param {Map<string, Set<string>>} map
   */
  constructor(map) {
    /**
     * @type {Map<string, Set<string>>}
     * @private
     */
    this._map = map;
  }

  /**
   * @return {Object.<string, string[]>}
   */
  toData() {
    const data = {};

    this._map.forEach((set, word) => {
      data[word] = Array.from(set);
    });

    return data;
  }

  /**
   * @param {string} sourceText
   * @return {string[]}
   */
  matchingWords(sourceText) {
    const sourceTextLowerCase = sourceText.toLowerCase();

    /** @type {Set<string>} */
    const resultSet = new Set();

    this._map.forEach((set, word) => {
      if (sourceTextLowerCase.indexOf(word.toLowerCase()) >= 0) {
        set.forEach((setWord) => {
          resultSet.add(setWord);
        });
      }
    });

    return Array.from(resultSet);
  }
}

module.exports = Manager;
