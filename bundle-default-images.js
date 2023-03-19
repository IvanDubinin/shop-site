/*delete ./default-json-images/defaultImagesModule.cjs for successful parse  */
const { fs, readdirSync, writeFileSync } = require('fs')
const rootDir = './src/assets/images/default'
const exportFileName = 'default-images-module.cjs'
const assetsLinkRoot = 'assets/images/default'
const exportFolderName = '.'
const folderList = readdirSync(rootDir)
const defaultImageArray = []

folderList.forEach((folder) => {
    const childFolder = buildPath(assetsLinkRoot, folder)
    const rootChild = buildPath(rootDir, folder)
    const childFolderFiles = readdirSync(rootChild)
    const imagesInChildFolder = []

    childFolderFiles.forEach(file => {
        const fullFilePath = buildPath(childFolder, file)
        imagesInChildFolder.push(`\"${fullFilePath}\"`)
        console.log(fullFilePath)
    })
    defaultImageArray.push(`[${imagesInChildFolder}]\n`)
})

writeFileSync(buildPath(exportFolderName, exportFileName),
    `const defaultImageArray=[${defaultImageArray}]\n
module.exports = { 
    defaultImageArray
}`)

function buildPath(...args) {
    let fullPath = '';
    for (let i = 0; i < args.length; i++) {
        fullPath = fullPath + '/' + args[i]
    }
    return fullPath.substring(1, fullPath.length)
}

