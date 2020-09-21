module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFiles: ['./tests/mocks/index.ts'],
  globalSetup: './jest.setup.ts',
  globalTeardown: './jest.teardown.ts',
  collectCoverageFrom: ['src/**/*{.ts,.tsx}'],
};
