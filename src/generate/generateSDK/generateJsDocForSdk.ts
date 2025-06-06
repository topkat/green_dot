import { GenericDef } from '../../lib/good-cop/src/index.js'
import { ServiceDocObject } from '../../types/services.types.js'
import { _ } from '../../validator.js'





export function generateJsDoc(doc: ServiceDocObject, outputValidator: GenericDef) {
  return `/** ${doc.description}${jsDocErrCodes(doc.errors)}${jsDocExample(outputValidator)}\n */`
}



function jsDocErrCodes(errDescr?: ServiceDocObject['errors']) {
  return errDescr?.length
    ? `\n     * @errorCodes\n${errDescr.map(([code, errMsg = '', errDescr = '']) => `     * - ${code}: ${errMsg}${errDescr ? ` - ${errDescr}` : ''}`)}`
    : ''
}

function jsDocExample(def: GenericDef = _.void()) {
  const example = def?.getExampleValue()
  if (example) {
    const aaa = JSON.stringify(example, null, 2)
      .replace(/\\*"/g, '\'')
      .replace(/\n/g, '\n     * ')
    return `\n     * @example\n     * ${aaa}`
  } else return ''
}