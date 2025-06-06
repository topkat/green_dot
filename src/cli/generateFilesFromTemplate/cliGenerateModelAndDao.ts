
import fs from 'fs-extra'
import { luigi } from '../helpers/luigi.bot.js'
import { capitalize1st } from 'topkat-utils'

export async function cliGenerateModelAndDao(fileName: string, filePathWithoutExtension: string) {

  await fs.outputFile(filePathWithoutExtension + '.model.ts', modelFileTemplate(fileName), 'utf-8')
  await fs.outputFile(filePathWithoutExtension + '.dao.ts', daoFileTemplate(fileName), 'utf-8')

  await luigi.openFile(filePathWithoutExtension + '.model.ts')
  await luigi.openFile(filePathWithoutExtension + '.dao.ts', true)

  luigi.tips(`In .dao.ts file, start by typing gd_dao to see available snippets to autocomplete 'expose', 'mask' and 'filter' fields`)

}

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

const modelFileTemplate = modelName => `
import { _ } from 'green_dot'

export const ${modelName}Model = _.mongoModel(['creationDate'], {

})

export default ${modelName}Model
export type ${capitalize1st(modelName)} = InferType<typeof model>
// type may differ when writing (create / update) vs reading
export type ${capitalize1st(modelName)}Write = InferTypeWrite<typeof model>
`

const daoFileTemplate = modelName => `
import { MongoDao } from 'green_dot'
import { ${capitalize1st(modelName)} } from './${modelName}.model.js'

const dao = {
    type: 'mongo',
    expose: [
      // type gd_dao:expose to expand snippet
    ],
    filter: [
      // type gd_dao:filter to expand snippet
    ],
    mask: [
      // type gd_dao:mask to expand snippet
    ],
    populate: []
} satisfies MongoDao<${capitalize1st(modelName)}>

export default dao
`