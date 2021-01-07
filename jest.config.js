module.exports = {
    preset: 'ts-jest',
    verbose: true,
    setupFilesAfterEnv: ['./src/test/setup-env.ts'],
    collectCoverageFrom: ['./src/**/*.ts'],
    coveragePathIgnorePatterns: ['.*/__tests__/.*'],
};
