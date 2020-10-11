module.exports = {
  preset: 'ts-jest',
  verbose: true,
  rootDir: './',
  roots: ['<rootDir>/client/', '<rootDir>/server/'],
  setupFilesAfterEnv: ['<rootDir>/client/plugins/vue-imports.ts'],
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
    '^@@/(.*)$': '<rootDir>/$1',
    '^~~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/server/$1',
    '^~/(.*)$': '<rootDir>/client/$1',
    '^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|spec.ts)$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  collectCoverage: true,
  collectCoverageFrom: [
    './client/**/*.ts',
    './server/**/*.ts',
    './client/**/*.vue',
    '!**/node_modules/**'
  ],
  coverageReporters: ['html', 'text-summary', 'json', 'lcov', 'clover']
};
