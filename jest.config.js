export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^react(.*)$': '<rootDir>/node_modules/react$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx', '.js'],
};
