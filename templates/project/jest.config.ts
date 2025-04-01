/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
    // testMatch: [
    //     '**/backend/**',
    //     '**/core-backend/**',
    // ],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage-jest',
    coverageProvider: 'v8',
    coverageReporters: ['text', 'html', 'json'],
    modulePathIgnorePatterns: ['dist'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.js$': './node_modules/babel-jest',
    },
    testRegex: ['.*backend.*\\.spec\\.[jt]sx?$'],
}

export default config
