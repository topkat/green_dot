import { unflattenObject } from 'topkat-utils'




export function displayObjectClean(object: Record<string, string>) {
  const objDeep = unflattenObject(object)
  for (const type of ['useQuery', 'prefetch', 'addQueriesToInvalidate', 'defer']) {
    for (const suffix of ['__COMMENT__', '']) {
      // OBJECT SORTING
      const val = objDeep[type + suffix]
      delete objDeep[type + suffix]
      objDeep[type + suffix] = val
    }
  }
  return JSON.stringify(objDeep, null, 4)
    .replace(/"/g, '')
    .replace(/\\n/g, '\n')
    .replace(/( +).*__COMMENT__[^:]*: ?/g, '$1')
    .replace(/\*\/,/g, '*/')
}