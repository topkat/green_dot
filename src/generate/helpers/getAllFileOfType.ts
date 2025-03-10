
import glob from 'fast-glob'

/**
 * @param {string} fileType Eg: '.model.js'
 */
export default function getAllFilesOfType(globPattern: string, ignore: string[] = []) {
    const allFiles = []
    glob.sync(globPattern).forEach(filePath => {
        if (!ignore.some(ignorePattern => filePath.includes(ignorePattern))) allFiles.push(filePath)
    })
    return allFiles
}