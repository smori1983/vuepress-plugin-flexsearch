const { Document } = require('flexsearch');

const matcher = require('./matcher');

class Database {
  constructor() {
    /**
     * Locale path specific FlexSearch document.
     *
     * @type {Map<string, Document>}
     * @private
     */
    this._docs = new Map();
  }

  /**
   * @param {string} localePath
   * @param {Object.<string, {dataForSearch: string}>} localeData
   */
  add(localePath, localeData) {
    if (!this._docs.has(localePath)) {
      this._docs.set(localePath, new Document({
        matcher: matcher,
        tokenize: 'forward',
        id: 'key',
        index: [
          'content',
        ],
      }));
    }

    for (const key in localeData) {
      this._docs.get(localePath).add({
        key: key,
        content: localeData[key].dataForSearch,
      });
    }
  }

  /**
   * @param {string} localePath
   * @param {string} query
   * @param {number} limit
   * @return {string[]} page key list.
   */
  search(localePath, query, limit) {
    if (!this._docs.has(localePath)) {
      return [];
    }

    return this._docs.get(localePath).search(query, {
      pluck: 'content',
      limit: limit,
    });
  }
}

module.exports = Database;
