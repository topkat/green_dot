
/** path shall always be sorted before using in express
 *  to avoid a generic route like /* to catch a specific one like /bonjour
 *
 * @param {Object[]} urlObjOrArr
 * @param {String} indexInArray
 * @return {Array} urls modified
 */
export function sortUrlsByDeepnessInArrayOrObject(urlObjOrArr: (string | ObjectGeneric | any[])[], indexInArray: number) {
    // SORTING BY
    // Deepness => /user vs /user/contract
    // simply count the / occurence to sort deepest path first to avoid concurrence or routes mislead
    const deepness = route => (route.match(/\//g) || []).length
    // AND params deepness
    // avoid `/user/:param` to take precedence over `/user/field` as `user/fields` will be catched by the first route
    // Eg: /user/:rr/name/:id => 14pts
    //     /user/:id/:name/id => 15pts take precedence
    const paramPrecedencePts = route => route.split('/').reduce((pts, routeChunk, i) => /^:/.test(routeChunk) ? pts + (10 - i) : pts, 0)

    return urlObjOrArr.sort((a, b) => {
        const aUrl = a[indexInArray] || a
        const bUrl = b[indexInArray] || b
        if (!aUrl) return -1
        if (!bUrl) return 1
        return deepness(bUrl) - deepness(aUrl) || // /a/b vs /a
            paramPrecedencePts(aUrl) - paramPrecedencePts(bUrl) || // /:dynamicparam vs /param
            bUrl.length - aUrl.length // help separating / vs /blah
    })
}