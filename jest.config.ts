/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testPathIgnorePatterns: ['/dist/'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
        }],
    },
    testMatch: ['**/*.spec.ts'],
    moduleDirectories: ['node_modules', 'dist', 'src'],
    modulePaths: ['<rootDir>/dist/src'],
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transformIgnorePatterns: [
        'node_modules/(?!(mongodb|mongodb-memory-server)/)',
    ],
    moduleNameMapper: {
        // Only map relative imports from the services directory
        '^\\./(maskService|populateService)\\.js$': '<rootDir>/dist/src/databases/mongo/services/$1.js',
        '^\\.\\./\\.\\./\\.\\./tests/(.*)\\.js$': '<rootDir>/dist/tests/$1.js',
    },
}

export default config
