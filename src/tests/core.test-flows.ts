/* SYNOPSIS

1) Check server alive
*/

const testFlow = {
    name: 'Core test flows',
    priority: 0, // should be fiorst test
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

export default testFlow
