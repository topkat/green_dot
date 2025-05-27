/* SYNOPSIS

1) Check server alive
*/

export const coreTestSuite = {
    name: 'Core test suite',
    priority: 0, // should be first test
    mandatory: true,
    items: [{
        doc: `Check server is alive`,
        method: 'GET',
        route: `/alive`,
        status: 200,
    }, {
        doc: `Test 404 route error`,
        method: 'GET',
        route: `/notExistingRoute/jé1groKiki/taJaméLuSa/test`,
        status: 404,
    }]
}
