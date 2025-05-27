
import fs from 'fs-extra'

export async function cliGenerateSeed(fileName: string, filePath: string) {
  const seedFileTemplate = `
import { db, dbs, svc } from 'green_dot'

export const ${fileName}Seed = svc({
    on: 'server.start',
    priority: 50, // change that to a lower number to make this script execute prior to other seed scripts
    async main(ctx) {
        // TODO use one of your \`dbs\` here or your default database with \`db\`
    },
})
`
  await fs.outputFile(filePath, seedFileTemplate, 'utf-8')
}