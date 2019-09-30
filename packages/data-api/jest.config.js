module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFiles: ['dotenv/config'],
  globalSetup: './jest.setup.js',
  globalTeardown: './jest.teardown.js',
  collectCoverageFrom: ['src/**/*{.ts,.tsx}'],
};
