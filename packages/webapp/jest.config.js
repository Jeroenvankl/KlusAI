const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  displayName: 'klusai-webapp',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/__tests__/**/*.test.{ts,tsx}'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
});
