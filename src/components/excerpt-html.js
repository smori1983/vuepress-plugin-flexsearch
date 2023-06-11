const { escape } = require('he');

class ExcerptHtml {
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
    this._plainTextBuffer = '';
  }

  /**
   * @param {string} text
   */
  addPlainText(text) {
    this._plainTextBuffer += text;
  }

  /**
   * @param {string} tag
   */
  addHtmlTag(tag) {
    this._flushPlainTextBuffer();
    this._result.push(tag);
  }

  /**
   * @return {string}
   */
  getResult() {
    this._flushPlainTextBuffer();

    return this._result.join('');
  }

  /**
   * @private
   */
  _flushPlainTextBuffer() {
    this._result.push(escape(this._plainTextBuffer));
    this._plainTextBuffer = '';
  }
}

module.exports = ExcerptHtml;
