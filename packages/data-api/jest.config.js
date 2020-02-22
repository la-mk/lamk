module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globalSetup: './jest.setup.ts',
  globalTeardown: './jest.teardown.ts',
  collectCoverageFrom: ['src/**/*{.ts,.tsx}'],
};
