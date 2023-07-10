class NgramSearch {
  constructor() {
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
   * @param {string} text
   */
  add(text) {
    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (/^[\x00-\x7f]$/.test(char)) {
        this._addAsciiChar(char);
        this._currentType = 'ascii';
      } else {
        this._addNonAsciiChar(char);
        this._currentType = 'nonAscii';
      }
    }
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
   * @return {string[]}
   */
  getResult() {
    if (this._currentType === 'ascii') {
      this._flushAsciiTextBuffer();
    } else if (this._currentType === 'nonAscii') {
      this._flushNonAsciiTextBuffer();
    }

    return this._result;
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

module.exports = NgramSearch;
