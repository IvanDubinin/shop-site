/*writes new json db file to project directory*/
const { writeFileSync } = require('fs');
const { faker } = require('@faker-js/faker');
const _ = require('lodash');
const pricesRange = {
  floor: 15,
  ceil: 15000
};
const highPrices = {
  range: {
    floor: 100000,
    ceil: 1500000
  },
  chance: 0.05
};
const decimalInPriceChance = 0.4; /*0 to 1*/
const pastYearsFromNowCreated = 7;
const generatorModes = {
  static: {
    mode: 'static',
    settings: {
      defaultProductsCount: 75,
      defaultCategoriesCount: 15,
      defaultUsersCount: 10,
      defaultReviewsCount: 10,
      defaultSellersCount: 10,
      defaultProductsInWishlistCount: 10,
      defaultWishlistsCount: 10,
      defaultUsersWithWishlistsCount: 3,
      defaultAddressBookCount: 10,
      defaultOrderCount: 10,
      jsonFileName: 'generated-db-static.json'
    }
  },
  internet: {
    mode: 'internet',
    settings: {
      defaultProductsCount: 250,
      defaultCategoriesCount: 15,
      defaultUsersCount: 10,
      defaultReviewsCount: 5,
      defaultSellersCount: 10,
      defaultProductsInWishlistCount: 10,
      defaultWishlistsCount: 10,
      defaultUsersWithWishlistsCount: 3,
      defaultAddressBookCount: 10,
      defaultOrderCount: 10,
      jsonFileName: 'generated-db-internet.json'
    }
  }
};

/* BY USING GENERATOR OLD FILE WILL BE OVERWRITTEN. */
const { imageArray } = require('./parsed-images/allImagesExportModule.cjs');
const { defaultImageArray } = require('./default-images-module.cjs');

function generateJsonInMode(generatorMode) {
  const folderToWriteTo = __dirname + '/' + generatorMode.settings.jsonFileName;
  const newJson = generateNewJsonWithOverwriting(generatorMode);
  writeFileSync(folderToWriteTo, newJson);
}

generateJsonInMode(generatorModes.internet);
generateJsonInMode(generatorModes.static);

function generateNewJsonWithOverwriting({ mode, settings }) {
  const numberOfCategories = settings.defaultCategoriesCount;
  const numberOfUsers = settings.defaultUsersCount;
  const numberOfReviews = settings.defaultReviewsCount;
  const numberOfSellers = settings.defaultSellersCount;
  const numberOfProducts = settings.defaultProductsCount;
  const numberOfProductsInWishlist = settings.defaultProductsInWishlistCount;
  const numberOfWishlistsPerUser = settings.defaultWishlistsCount;
  const numberOfUsersWithWishlists = settings.defaultUsersWithWishlistsCount;
  const numberOfProductDetailLines = faker.datatype.number({ min: 3, max: 9 });
  const numberOfProductDescriptionLines = faker.datatype.number({ min: 5, max: 15 });
  const numberOfAddressBooks = settings.defaultAddressBookCount;
  const numberOfOrders = settings.defaultOrderCount;

  const createdDate = buildCreatedDateInMs(pastYearsFromNowCreated);
  const imageCreator =
    mode === generatorModes.static.mode ? getStaticImagesForProduct : getInternetImagesForProduct;

  const categoriesList = Array.from(buildCategoriesNameSet(numberOfCategories)).map(
    (catName, index) => buildSingleCategory(catName, index)
  );

  const addressCountryList = [
    { id: 0, name: 'Russia' },
    { id: 1, name: 'Belarus' },
    { id: 2, name: 'Ukraine' },
    { id: 3, name: 'Kazakhstan' },
    { id: 4, name: 'France' },
    { id: 5, name: 'Germany' },
    { id: 6, name: 'Italy' }
  ];
  const addressCityList = [
    {
      countryId: 0,
      name: [
        'Moscow',
        'Saint Petersburg',
        'Novosibirsk',
        'Yekaterinburg',
        'Kazan',
        'Krasnodar',
        'Vladivostok'
      ]
    },
    {
      countryId: 1,
      name: [
        'Minsk',
        'Barysaw',
        'Salihorsk',
        'Maladzyechna',
        'Zhodzina',
        'Dzyarzhynsk',
        'Smalyavichy'
      ]
    },
    { countryId: 2, name: ['Kyiv', 'Kharkiv', 'Odessa', 'Dnipro', 'Lviv', 'Mariupol', 'Luhansk'] },
    {
      countryId: 3,
      name: ['Aktau', 'Aktobe', 'Zhezkazgan', 'Kentau', 'Kostanay', 'Nur-Sultan', 'Pavlodar']
    },
    { countryId: 4, name: ['Paris', 'Lyon', 'Rennes', 'Angers', 'Brest', 'Amiens', 'Argenteuil'] },
    {
      countryId: 5,
      name: ['Berlin', 'Hamburg', 'Munich', 'Stuttgart', 'Bremen', 'Dresden', 'Mannheim']
    },
    { countryId: 6, name: ['Rome', 'Turin', 'Florence', 'Catania', 'Venice', 'Messina', 'Modena'] }
  ];

  const sellersList = Array.from(buildSellersNameSet(numberOfSellers)).map((sellName, index) =>
    buildSingleSeller(sellName, index)
  );

  const productsList = _.times(numberOfProducts, function (n) {
    let randomCategory = faker.helpers.randomize(categoriesList);
    let randomSeller = faker.helpers.randomize(sellersList);

    const price = generatePrices() + generateDecimals();
    const randomDiscountPercentage = faker.datatype.number({ min: 1, max: 99 });
    const discountPrice = +(price * randomDiscountPercentage / 100).toFixed(2);

    return {
      id: n,
      name: faker.commerce.productName(),
      category: randomCategory.id,
      categoryName: randomCategory.name,
      description: buildProductDescription(numberOfProductDescriptionLines),
      price,
      discountPrice,
      images: imageCreator(),
      details: buildProductDetails(numberOfProductDetailLines),
      createdAt: createdDate,
      updatedAt: buildUpdatedDateInMs(createdDate),
      sellerId: randomSeller.id,
      sellerName: randomSeller.name
    };
  });

  const orderList = buildOrderList(numberOfOrders, productsList);

  const usersList = Array.from(buildUsersEmailSet(numberOfUsers)).map((userEmail, index) =>
    buildSingleUser(userEmail, index, orderList)
  );

  const consumerUsersList = usersList.filter((user) => user.role === 'consumer');

  const addressBookList = Array.from(buildAddressBookSet(numberOfAddressBooks)).map(
    (addressName, index) => buildSingleAddressBook(addressName, index, usersList, addressCountryList, addressCityList)
  );

  const reviewsList = _.times(numberOfReviews, function () {
    let randomAuthor = faker.helpers.randomize(consumerUsersList);
    return {
      id: faker.datatype.number({ min: 1, max: 100 }),
      rating: generateReviewRating(numberOfReviews),
      comment: faker.lorem.words(35),
      author: generateReviewAuthorName(randomAuthor),
      productId: faker.helpers.randomize(productsList).id,
      userId: randomAuthor.id,
      createdAt: createdDate,
      updatedAt: buildUpdatedDateInMs(createdDate)
    };
  });

  const consumerUsersWithWishlists = faker.helpers.uniqueArray(consumerUsersList, numberOfUsersWithWishlists);
  let wishlistStartingIndex = 0;
  const wishlists = consumerUsersWithWishlists
    .flatMap((user) => {
      const result = buildWishlistsForOneUser(user, numberOfWishlistsPerUser, productsList, numberOfProductsInWishlist, wishlistStartingIndex);
      wishlistStartingIndex += result.length;
      return result;
    });

  const dataToParseByJson = {
    categories: categoriesList,
    products: productsList,
    users: usersList,
    reviews: reviewsList,
    sellers: sellersList,
    wishlists: wishlists,
    addressBook: addressBookList,
    country: addressCountryList,
    city: addressCityList,
    orders: orderList
  };
  console.log('generateNewJson script has finished');
  return JSON.stringify(dataToParseByJson);
}

function generatePrices() {
  const randomVal = Math.random();
  let range = randomVal <= highPrices.chance ? highPrices.range : pricesRange;
  return Number(faker.commerce.price(range.floor, range.ceil, 0));
}

function generateDecimals() {
  const randomVal = Math.random();
  if (randomVal <= decimalInPriceChance) {
    return Number(randomVal.toFixed(2));
  }
  return 0;
}

function generateReviewRating() {
  return Math.floor(Math.random() * 5 + 1);
}

function generateReviewAuthorName(authorName) {
  let randomNum = Math.random();
  return randomNum < 0.8 ? `${authorName.firstName} ${authorName.lastName}` : 'Anonymous';
}

function buildSingleCategory(catName, index) {
  const createdDate = buildCreatedDateInMs(pastYearsFromNowCreated);
  return {
    id: index,
    name: catName,
    description: faker.lorem.sentence(),
    createdAt: createdDate,
    updatedAt: buildUpdatedDateInMs(createdDate)
  };
}

function buildCategoriesNameSet(numberOfCategories) {
  const categoriesSet = new Set();
  while (categoriesSet.size < numberOfCategories) {
    categoriesSet.add(faker.commerce.department());
  }
  return categoriesSet;
}

function buildUserRole() {
  const seed = Math.floor(Math.random() * 6);
  switch (seed) {
    case 0:
      return 'admin';
    case 1:
    case 2:
      return 'seller';
    default:
      return 'consumer';
  }
}

function buildSingleUser(userEmail, index, orderList) {
  const spentMoney = orderList
    .filter(order => order.userId === index && ['PAID', 'DELIVERED'].includes(order.status))
    .reduce((acc, order) => acc += order.totalPrice, 0);
  return {
    id: index,
    picture: faker.image.avatar(),
    title: faker.name.prefix(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    gender: faker.name.gender(),
    email: userEmail,
    dateOfBirth: buildDateOfBirth(),
    phoneNumber: faker.phone.phoneNumberFormat(),
    password: 'Qwerty123!',
    role: buildUserRole(),
    spentMoney
  };
}

function buildUsersEmailSet(numberOfUsers) {
  const usersSet = new Set();
  while (usersSet.size < numberOfUsers) {
    usersSet.add(faker.internet.email());
  }
  return usersSet;
}

function buildSingleSeller(sellName, index) {
  return {
    id: index,
    name: sellName,
    description: faker.lorem.sentence()
  };
}

function buildSingleAddressBook(addressName, index, usersList, addressCountryList, addressCityList) {
  const randomUser = faker.helpers.randomize(usersList);

  const countryIndex = faker.datatype.number({ min: 0, max: 6 });
  const cityIndex = faker.datatype.number({ min: 0, max: 6 });

  return {
    id: index,
    title: faker.name.prefix(),
    name: addressName,
    surname: faker.name.lastName(),
    phone: faker.phone.phoneNumberFormat(),
    country: addressCountryList[countryIndex].name,
    city: addressCityList[countryIndex].name[cityIndex],
    street: faker.address.streetName(),
    building: faker.datatype.number({ max: 100 }),
    flat: faker.datatype.number({ max: 100 }),
    zip: faker.address.zipCode(),
    userId: randomUser.id
  };
}

function buildSellersNameSet(numberOfSellers) {
  const sellersSet = new Set();
  while (sellersSet.size < numberOfSellers) {
    sellersSet.add(faker.company.companyName());
  }
  return sellersSet;
}

function buildAddressBookSet(numberOfAddressBooks) {
  const addressSet = new Set();
  while (addressSet.size < numberOfAddressBooks) {
    addressSet.add(faker.name.firstName());
  }
  return addressSet;
}

function buildCreatedDateInMs(pastUntil) {
  return faker.date.past(pastUntil).getTime();
}

function buildDateOfBirth() {
  return faker.date.past(22).getTime();
}

function buildUpdatedDateInMs(dateToBuildFromInMs) {
  const formattedDate = new Date(dateToBuildFromInMs);
  return faker.date.between(formattedDate, new Date(Date.now())).getTime();
}

function getStaticImagesForProduct() {
  return faker.helpers.randomize(defaultImageArray);
}

function getInternetImagesForProduct() {
  const categoryArray = faker.helpers.randomize(imageArray);
  const productArray = faker.helpers.randomize(categoryArray);
  return productArray;
}

function buildProductDetails(numberOfLines) {
  const productDetails = {};
  _.times(numberOfLines, () => {
    let line = faker.lorem.word();
    while (productDetails[line]) {
      line = faker.lorem.word();
    }
    productDetails[line] = faker.lorem.sentences(1);
  });
  return productDetails;
}

function buildProductDescription(numberOfLines) {
  const productDescription = [];
  _.times(numberOfLines, () => {
    const line = Math.random() <= 0.75 ? faker.lorem.lines(1) : faker.lorem.paragraph(2);
    productDescription.push(line);
  });
  return productDescription;
}

function buildWishlistsForOneUser(user, maxNumberOfWishlists, products, maxNumberOfProductsInWishlist, wishlistStartingIndex) {
  const numberOfWishlists = Math.floor(Math.random() * (maxNumberOfWishlists)) + 1;
  return _.times(numberOfWishlists, () => buildWishlistForOneUser(user, products, maxNumberOfProductsInWishlist, wishlistStartingIndex++));
}

function buildWishlistForOneUser(user, products, maxNumberOfProductsInWishlist, index) {
  const quantity = Math.floor(Math.random() * (maxNumberOfProductsInWishlist + 1));
  const liked = faker.helpers
    .uniqueArray(products, quantity)
    .map(p => p.id);
  return {
    id: index,
    name: faker.lorem.words(2),
    isDefault: index === 0,
    userId: user.id,
    products: liked
  };
}

//order entity
function buildOrderList(count, productList) {
  const orderList = [];
  let id = 1;
  while (orderList.length < count) {
    orderList.push(buildSingleOrder(id, productList));
    id += 1;
  }
  return orderList;
}

function buildSingleOrder(id, productList) {
  const createdAt = Date.now();
  const userId = faker.datatype.number({ min: 0, max: 9 });

  const orderStatuses = ['WAITING_FOR_PAYMENT', 'PAID', 'DELIVERED', 'CANCELLED'];
  const orderProductList = buildProductListForOrder(productList);
  const totalPriceOfProducts = orderProductList.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return {
    id,
    userId,
    products: orderProductList,
    status: orderStatuses[Math.floor(Math.random() * 4)],
    deliveryPrice: 90,
    totalPrice: +(totalPriceOfProducts + 90).toFixed(2),
    createdAt,
    updatedAt: createdAt,
    deliveredAt: null,
    deliveryType: 'Courier service delivery',
    deliveryAddress: 1
  };
}

function buildProductListForOrder(productList) {
  const orderProductCount = faker.datatype.number({ min: 1, max: 5 });
  const orderProductList = [];
  while (orderProductList.length < orderProductCount) {
    orderProductList.push(buildProductItemForOrder(productList));
  }
  return orderProductList;
}

function buildProductItemForOrder(productList) {
  let randomProduct = faker.helpers.randomize(productList);
  return {
    originalProductId: randomProduct.id,
    categoryId: randomProduct.category,
    price: randomProduct.price,
    quantity: faker.datatype.number({ min: 1, max: 5 })
  };
}
