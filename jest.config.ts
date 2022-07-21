import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

// Sync object
const config: Config.InitialOptions = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', 'src'],
  rootDir: './',
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/__tests__/mock-files',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  collectCoverage: true,
  collectCoverageFrom: ['./src/**'],
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      lines: 10,
      functions: 10,
      statements: 10,
      branches: 10,
    },
  },
}
export default config
