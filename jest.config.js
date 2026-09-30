module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/js/**/*.js',
    '!src/js/**/__tests__/**',
    '!src/js/app.js',
  ],
  coverageDirectory: 'coverage',
};