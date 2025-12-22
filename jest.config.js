module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/frontend/(.*)$': '<rootDir>/src/frontend/$1',
    '^@/backend/(.*)$': '<rootDir>/src/backend/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
  },
};