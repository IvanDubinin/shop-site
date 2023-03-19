const { readdirSync, writeFileSync } = require('fs')
const fileToWriteTo = './parsed-images/allImagesExportModule.cjs'
const imageFileVariablePostfix = 'Array'
const folder = './parsed-images/';
const {fileNames, categoryNames} = getImportVariableNames(folder)
const importString = buildImportString(fileNames, categoryNames)
const exportString = buildExportString(categoryNames)
const dataToWrite = importString + exportString
writeFileSync(fileToWriteTo, dataToWrite)
console.log('completed: bundle-image-modules.cjs');

function buildExportString(categoryNames) {
    let imageArray = categoryNames.reduce((acc, catName)=> {
        return acc += catName +',\n'
    },'\nconst imageArray = [\n')
    imageArray =  imageArray+']\n'
    const moduleExpString = 'module.exports = { imageArray }'
    return imageArray+ moduleExpString
}

function buildImportString(fileNames, categoryNames) {
    return fileNames.reduce((acc, fName, i) => {
        return acc = acc + buildImportExp(fileNames[i], categoryNames[i])
    }, '')

}

function buildImportExp(fileName, variableName) {
    return `const {${variableName}} = require('${fileName}')\n`
}


function getImportVariableNames(folder) {
    console.log('im in get import')
    const categoryNames = []
    const fileNames = []
    const files = readdirSync(folder)
    files.forEach( fileName => {
        const exportVariableName = getCategoryNameFromFileName(fileName) + imageFileVariablePostfix
        categoryNames.push(exportVariableName)
        fileNames.push('\.\/'+fileName)
    })
    return { categoryNames, fileNames }
}



function getCategoryNameFromFileName(fileName) {
    const symbolsArray = fileName.split('');
    const substrStart = symbolsArray.indexOf('_') + 1
    const substrEnd = symbolsArray.indexOf('.')
    const category = fileName.substring(substrStart, substrEnd)
    return category
}