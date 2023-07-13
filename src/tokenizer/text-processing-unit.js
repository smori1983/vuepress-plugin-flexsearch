class TextProcessingUnit {
  /**
   * @param {string} input
   */
  constructor(input) {
    /**
     * @type {string}
     * @private
     */
    this._input = input;

    /**
     * @type {string[]}
     * @private
     */
    this._result = [];

    /**
     * @type {string}
     * @private
     */
    this._currentType = '';

    /**
     * @type {string}
     * @private
     */
    this._asciiTextBuffer = '';

    /**
     * @type {string}
     * @private
     */
    this._nonAsciiTextBuffer = '';
  }

  /**
   * @return {string[]}
   */
  getResult() {
    for (let i = 0; i < this._input.length; i++) {
      const char = this._input[i];

      if (/^[\x00-\x7f]$/.test(char)) {
        this._addAsciiChar(char);
        this._currentType = 'ascii';
      } else {
        this._addNonAsciiChar(char);
        this._currentType = 'nonAscii';
      }
    }

    if (this._currentType === 'ascii') {
      this._flushAsciiTextBuffer();
    } else if (this._currentType === 'nonAscii') {
      this._flushNonAsciiTextBuffer();
    }

    return this._result;
  }

  /**
   * @param {string} char
   * @private
   */
  _addAsciiChar(char) {
    this._flushNonAsciiTextBuffer();
    this._asciiTextBuffer += char;
  }

  /**
   * @param {string} char
   * @private
   */
  _addNonAsciiChar(char) {
    this._flushAsciiTextBuffer();
    this._nonAsciiTextBuffer += char;
  }

  /**
   * @private
   */
  _flushAsciiTextBuffer() {
    if (this._asciiTextBuffer.length > 0) {
      this._result.push(this._asciiTextBuffer);
      this._asciiTextBuffer = '';
    }
  }

  /**
   * @private
   */
  _flushNonAsciiTextBuffer() {
    if (this._nonAsciiTextBuffer.length > 0) {
      this._result.push(this._nonAsciiTextBuffer);
      this._nonAsciiTextBuffer = '';
    }
  }
}

module.exports = TextProcessingUnit;
