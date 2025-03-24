
import fs from 'fs-extra'

export async function cliGenerateErrorFile(filePathWithoutExt: string) {

  const errFileTemplate = `
import { registerErrors } from 'green_dot'

export default registerErrors({
    exempleError: { code: 400 },
})
`
  await fs.outputFile(filePathWithoutExt, errFileTemplate, 'utf-8')

}