// import getAllFilesOfType from './preBuild/getAllFileOfType'
// import fs from 'fs-extra'
// import path from 'path'

// import { allMatches, pushIfNotExist, firstMatch } from 'topkat-utils'


export async function generateEnvFile(generatedFilePathServer: string) {
    // TODO FIX AND PUT BACK ACTUALLY infinite RegExp Loop in some cases
    // const ignore = ['node_modules', '/dist', '/build', 'frontend', 'template', 'generate']
    // const allConfigFilesFromProject = await getAllFilesOfType('**/*.ts', ignore)
    // const allConfigFiles = await getAllFilesOfType('../../packages/**/*.ts', ignore)
    // const allEnvVars = []

    // for (const filePath of [...allConfigFiles, ...allConfigFilesFromProject]) {
    //     const fileContent = fs.readFileSync(filePath, 'utf-8')
    //     if (/(ENV|process.env)/.test(fileContent)) {
    //         const match = firstMatch(fileContent, /const {((?:\s|.){0,999})} = (?:ENV|process.env)/)
    //         if (match) match.split('\n').forEach(line => {
    //             if (!/\s*\/\//.test(line)) {
    //                 const allMatches2 = allMatches(line, / [A-Z0-9_]+[ ,}]/g)
    //                 allMatches2.map(([matchedStr]) => pushIfNotExist(allEnvVars, matchedStr.replace(/[ ,}]/g, '')))
    //             }
    //         })
    //     }
    // }

    // const separator = ` = ''\n`
    // fs.outputFileSync(path.join(generatedFilePathServer, 'generated.env'), allEnvVars.join(separator) + separator)
}