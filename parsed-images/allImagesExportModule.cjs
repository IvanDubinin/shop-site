const {constructionRadioArray} = require('./parsed-image_constructionRadio.cjs')
const {electricBikesArray} = require('./parsed-image_electricBikes.cjs')
const {kitchenStovesArray} = require('./parsed-image_kitchenStoves.cjs')
const {laptopsArray} = require('./parsed-image_laptops.cjs')
const {smartphonesArray} = require('./parsed-image_smartphones.cjs')
const {toolKitsArray} = require('./parsed-image_toolKits.cjs')
const {tvsArray} = require('./parsed-image_tvs.cjs')
const {washingMachinesArray} = require('./parsed-image_washingMachines.cjs')

const imageArray = [
constructionRadioArray,
electricBikesArray,
kitchenStovesArray,
laptopsArray,
smartphonesArray,
toolKitsArray,
tvsArray,
washingMachinesArray,
]
module.exports = { imageArray }