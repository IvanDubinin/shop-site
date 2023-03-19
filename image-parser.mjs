import { writeFile } from 'fs/promises';
import puppeteer from 'puppeteer'
// import { PuppeteerExtra, PuppeteerExtraPlugin} from 'puppeteer-extra';
//!!!!!  Parsed on puppeteer@13.3.2. before 1st launch requires: npm i puppeteer 
//!!WARNING successful script completion will OVERWRITE existing category file in parsed-image folder 
// uncaught error during script evaluation will leave files untouched
const websiteRoot = {
  smartphones: "https://www.dns-shop.ru/catalog/17a8a01d16404e77/smartfony/",
  laptops: 'https://www.dns-shop.ru/catalog/17a892f816404e77/noutbuki/',
  electricBikes: 'https://www.dns-shop.ru/catalog/c0642281265965de/elektrovelosipedy/',
  kitchenStoves: 'https://www.dns-shop.ru/catalog/e239e04839157fd7/plity-gazovye/',
  drills: 'https://www.dns-shop.ru/catalog/17a9c58016404e77/dreli/',
  toolKits: 'https://www.dns-shop.ru/catalog/4f13d297614d7fd7/nabory-elektroinstrumentov/',
  constructionRadio:'https://www.dns-shop.ru/catalog/9ce1742ba8b27fd7/stroitelnoe-radio/',
  tvs: 'https://www.dns-shop.ru/catalog/17a8ae4916404e77/televizory/?order=2',
  washingMachines: 'https://www.dns-shop.ru/catalog/c01df46f39137fd7/stiralnye-mashiny/?order=2'
}

const categories = {
  smartphones: 'smartphones',
  laptops: 'laptops',
  electricBikes: 'electricBikes',
  kitchenStoves: 'kitchenStoves',
  drills: 'drills',
  toolKits: 'toolKits',
  constructionRadio: 'constructionRadio',
  tvs: 'tvs',
  washingMachines: 'washingMachines'
}

const loadMoreSelector = '#products-list-pagination > button'
const linkToPDPSelector = '[data-id="product"] a[class*="catalog-product__name"]'
const linkToPLPImage = 'div.catalog-product__image > a > picture > source:nth-child(1)';
const sliderLinkSelector = 'img[class*="product-images-slider__main-img"]'
const smallSliderChildrenSelector = '.media-viewer-slider__wrap>div'
const smallSliderSelector = '.media-viewer-slider__wrap'
const mainImageSelector = '.media-viewer-image__main-img'
// const myClick = Event('click')
const configParams = {
  awaitDomContentNoTimeout: {
    timeout: 0,
    waitUntil: 'domcontentloaded'
  },
  awaitNetworkidleZeroNoTimeout: {
    timeout: 0,
    waitUntil: 'networkidle0'
  },
  awaitNetworkidleTwoNoTimeout: {
    timeout: 0,
    waitUntil: 'networkidle2'
  },
  noTimeout: {
    timeout: 0
  },
  clickDelay: { delay: 2000 },
  sliderTimeout: { timeout: 5000 },
  waitForTimeoutSettings: 1000
}

let clickLoadButtonXTimes = 6; //each DNS-shop website page contains 18 elements
const maxImagesPerProduct = 10 // if there're too many photos per product, parsing'll be extremely long
async function getPic() {
  // const puppeteer = new PuppeteerExtra()
  // puppeteer.use(PuppeteerExtraPlugin)
  const currentCategory = categories.washingMachines
  const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1920, height: 1080 } });
  const page = await browser.newPage();

  await page.goto(websiteRoot[currentCategory], configParams.awaitDomContentNoTimeout);
  await page.waitForSelector('h1', configParams.noTimeout).then(() => console.log('resolved h1'))

  for (let i = clickLoadButtonXTimes; i > 1; i--) {
    try {
    await page.waitForSelector(loadMoreSelector, {
      timeout: 5000
    })}
    catch {
      break;
    }
    clickLoadButtonXTimes--
   
    const res = await page.click(loadMoreSelector, configParams.clickDelay)
    if (res === null) {
      break;
    }
  }
  await page.waitForSelector(linkToPDPSelector, configParams.noTimeout)


  const {linksToPages, arrayOfImages} = await page.evaluate((linkToPDPSelector,linkToPLPImage) => {
    const nodes = document.querySelectorAll(linkToPDPSelector)//('body > div.container.category-child > div > div.products-page__content > div.products-page__list > div.products-list > div > div:nth-child(1) > div:nth-child(3) > div.catalog-product__image > a > picture > source:nth-child(1)')
    const smallImages = document.querySelectorAll(linkToPLPImage)
    const linkContainer = []
    const smallImageContainer = []
    nodes.forEach((tag, i) => {
      if (tag?.href) {
        linkContainer.push(tag.href)
      }
    })
    smallImages.forEach(pictureTag => {
      if (pictureTag?.dataset?.srcset) {
        smallImageContainer.push([`\"${pictureTag.dataset.srcset}\"`])
      }
    })
    return {
      arrayOfImages: smallImageContainer,
      linksToPages: linkContainer
    }
  }, linkToPDPSelector,linkToPLPImage)
  console.log('arrayOfImages is ', arrayOfImages)
  for (let i = 0; i < linksToPages.length; i++) {//linksToPages.length

    const currentPage = await openAndReturnPage(linksToPages[i], page, sliderLinkSelector)
    await clickOnPage(sliderLinkSelector, currentPage)
    const nodes = await getDomNodes(currentPage, smallSliderChildrenSelector);
    const currentImages = await parseNodesReturnLinkArray(page, nodes, smallSliderSelector, mainImageSelector)
    if (currentImages.length > 0) {
      console.log('arrayOfImages[i] before push', arrayOfImages[i])
      arrayOfImages[i].push(...currentImages)
      console.log('arrayOfImages[i] after push', arrayOfImages[i])
    }
  }
  // const arrayOfImages=[["\"123\"","\"123\""],["\"234\"","\"234\""]]
  console.log('parsed images are')
  const res = arrayOfImages.map(el => `\[${el}\]\n`)
  await browser.close();
  await writeFile(`./parsed-images/parsed-image_${currentCategory}.cjs`, `const ${currentCategory}Array=[${res}] \n module.exports= {${currentCategory}Array}`)
}

getPic();

async function openAndReturnPage(link, page, waitSelector) {
  await page.goto(link, configParams.awaitNetworkidleZeroNoTimeout)
  await page.waitForSelector(waitSelector, configParams.noTimeout)
  return page
}

async function getDomNodes(page, selector) {
  const nodeList = await page.evaluate((selector) => {
    const nodes = Array.from(document.querySelectorAll(selector)) //value must be serializable
    return nodes
  }, selector)
  return nodeList;
}

async function clickOnPage(selector, page) {
  try {
    console.log('in clickOnPage, selector', selector)
    // await page.hover(selector)
    // console.log('in clickOnPage hovered...!');
    await page.click(selector, configParams.clickDelay)
    console.log('in clickOnPage clicked...!');
    await page.waitForTimeout(configParams.waitForTimeoutSettings)
    return;
  } catch (err) {
    console.log(err.message)
    return null
  }
}
async function parseNodesReturnLinkArray(page, nodeList, smallSliderSelector, mainImageSelector) {
  const linkArray = []
  const parseUntil = nodeList.length <= maxImagesPerProduct ? nodeList.length: maxImagesPerProduct;
  console.log('in parseNodesReturnLinkArray start')
  for (let i = 1; i < parseUntil; i++) {//if i = 0, first image will be doubled in result
    await clickOnPage(`${smallSliderSelector}>div:nth-child(${i})`, page)
    await page.waitForTimeout(configParams.waitForTimeoutSettings)
    console.log('picking data in cycle, node is ', nodeList[i])
    const image = await page.evaluate((mainImageSelector) => {
      const mainImage = document.querySelector(mainImageSelector)?.src;

      if (mainImage) {
        return mainImage
      }
    }, mainImageSelector)
    if (image) {
      linkArray.push(`\"${image}\"`)
    }
  }
  console.log('returning from parseNodesReturnLinkArray, data is ', linkArray)
  return linkArray
}