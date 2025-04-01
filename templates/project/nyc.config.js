module.exports = {
    'extends': '@istanbuljs/nyc-config-typescript',
    // 'all': true, // NOT WORKING CORRECTLY
    // "extension": [
    //     ".ts",
    //     ".tsx"
    // ],
    // // 'cwd': '../../',
    // 'excludeNodeModules': false,
    // NOT WORKING WITH PACKAGES
    // 'include': [
    //     '**/backend/src/**/*.ts',
    //     '**/core-backend/**/*.ts',
    //     '**/backend-shared/**/*.ts',
    //     '**/../../shared/constants/**/*.ts',
    // ],
    'exclude': [
        '**/test/**',
        '**/*.spec.ts',
        '**/*.test-flow.ts',
        '**/mock/**/*',
        '**/*.test.ts',
        '**/frontend/**/*',
        '**/*.d.ts',
        '**/templates/**/*',
    ],
    'reporter': [
        'text',
        'html',
        'json',
    ],
}