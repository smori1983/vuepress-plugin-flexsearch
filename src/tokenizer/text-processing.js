const TextProcessingUnit = require('./text-processing-unit');

class TextProcessing {
  constructor() {
    /**
     * @type {TextProcessingUnit[]}
     * @private
     */
    this._units = [];
  }

  /**
   * @param {string} text
   */
  add(text) {
    text.split(/\s+/).forEach((part) => {
      this._units.push(new TextProcessingUnit(part));
    });
  }

  /**
   * @return {string[]}
   */
  getResult() {
    return this._units
      .map((unit) => {
        return unit.getResult();
      })
      .reduce((previous, current) => {
        return previous.concat(current);
      }, []);
  }
}

module.exports = TextProcessing;
