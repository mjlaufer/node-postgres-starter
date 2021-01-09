const config = require('./jest.config');

module.exports = {
    ...config,
    testPathIgnorePatterns: ['node_modules', 'dist'],
    testMatch: ['**/__tests__/**/*.ts'],
    collectCoverage: false,
};
