const { fs, writeFileSync, mkdirSync } = require('fs')
const puppeteer = require('puppeteer')


const { imageArray } = require('./parsed-images/allImagesExportModule.cjs')
const arrayToDownload = imageArray[6] //pick any endpoint array of available //7 is washingMachines
const folderToWriteTo = './src/assets/images/default'
console.log('arrayToDownloadLength is ' + arrayToDownload.length)
const fileExtension = 'jpg'
// console.log('arrayToDownload', arrayToDownload)
downloadImagesFromArray()

async function downloadImagesFromArray() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    let mainBuffer = []
    let currentBuffer = []
    page.on('response', res => {
        if (res.status() !== 404) {
            res.buffer().then(file => {
                currentBuffer.push(file)
            })
        }
    })

    for (let i = 0; i < arrayToDownload.length; i++) {//arrayToDownload.length
        const currentImages = arrayToDownload[i]
        console.log('currentImages.length is  is ' + currentImages.length)

        let currImagesThreshold;
        if (currentImages.length > 3) {
            currImagesThreshold = 3
        } else {
            currImagesThreshold = currentImages.length
        }

        for (let j = 0; j < currImagesThreshold; j++) {//currentImages.length
            let url = currentImages[j];
            await page.goto(url, { waitUntil: 'networkidle2' })
            await page.waitForSelector('img')

        }

        const fulfilledBuffer = Array.from(currentBuffer)
        mainBuffer.push(fulfilledBuffer)
        console.log('fulfilledBuffer.length', fulfilledBuffer.length)
        console.log('MainBuffer.length', mainBuffer.length)
        currentBuffer.length = 0;

    }
    await browser.close()
    mainBuffer.forEach((currentBuffer, i) => {
        const localBufferFolder = `${i}`
        console.log('mkdirPath is', folderToWriteTo + '/' + localBufferFolder)
        mkdirSync(folderToWriteTo + '/' + localBufferFolder)
        currentBuffer.forEach((buffer, j) => {
            const fileName = `${j}.${fileExtension}`
            writeFileSync(folderToWriteTo + '/' + localBufferFolder + '/' + fileName, buffer)
        })
    })


}