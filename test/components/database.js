const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;

const Database = require('../../src/components/database');
const ngram = require('../../src/tokenizer/ngram');

/**
 * @param {string[]} tokens
 */
const pageData = (tokens) => {
  return {
    dataForSearch: ngram.createForTokens(tokens, 3),
  };
};

/**
 * @param {Database} database
 * @param {string} localePath
 * @param {string} query
 */
const search = (database, localePath, query) => {
  return database.search(localePath, ngram.createForSearch(query, 3), 10);
};

describe('components', () => {
  describe('database', () => {
    describe('simple search', () => {
      const database = new Database();
      database.add('/', {
        'v-001': pageData(['動物', '犬', '猫']),
        'v-002': pageData(['動物', '鳥', '魚']),
      });

      it('search: 1', () => {
        const result = search(database, '/', '犬');

        assert.deepStrictEqual(result, ['v-001']);
      });

      it('search: 2', () => {
        const result = search(database, '/', '魚');

        assert.deepStrictEqual(result, ['v-002']);
      });

      it('search: 3', () => {
        const result = search(database, '/', '動物');

        assert.deepStrictEqual(result, ['v-001', 'v-002']);
      });
    });

    describe('multiple locale paths', () => {
      const database = new Database();
      database.add('/', {
        'v-101': pageData(['日本']),
        'v-102': pageData(['アメリカ']),
      });
      database.add('/en/', {
        'v-201': pageData(['Japan']),
        'v-202': pageData(['USA']),
      });

      it('search: 1', () => {
        const result = search(database, '/', '日本');

        assert.deepStrictEqual(result, ['v-101']);
      });

      it('search: 2', () => {
        const result = search(database, '/', 'Japan');

        assert.deepStrictEqual(result, []);
      });

      it('search: 3', () => {
        const result = search(database, '/en/', '日本');

        assert.deepStrictEqual(result, []);
      });

      it('search: 4', () => {
        const result = search(database, '/en/', 'Japan');

        assert.deepStrictEqual(result, ['v-201']);
      });
    });

    describe('matcher', () => {
      const database = new Database();
      database.add('/', {
        'v-001': pageData(['１２３', 'いぬ', 'ねこ']),
        'v-002': pageData(['123', 'イヌ', 'ネコ']),
      });

      it('search: 1', () => {
        const result = search(database, '/', '123');

        assert.deepStrictEqual(result, ['v-001', 'v-002']);
      });

      it('search: 2', () => {
        const result = search(database, '/', '１２３');

        assert.deepStrictEqual(result, ['v-001', 'v-002']);
      });

      it('search: 3', () => {
        const result = search(database, '/', 'ねこ');

        assert.deepStrictEqual(result, ['v-001', 'v-002']);
      });
    });
  });
});
