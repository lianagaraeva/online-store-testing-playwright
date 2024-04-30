import { test, expect } from '@playwright/test'
import InventoryPage from '../src/pages/inventoryPage'
import ItemPage from '../src/pages/itemPage'
import CartPage from '../src/pages/cartPage'
import CheckoutStepOnePage from '../src/pages/checkoutStepOnePage'
import CheckoutStepTwoPage from '../src/pages/checkoutStepTwoPage'
import CheckoutCompletePage from '../src/pages/checkoutCompletePage'
import Logout from '../src/pages/logoutPage'

test.describe('Разработка E2E тестов для интернет-магазина с помощью Playwright', async () => {
  test('Отображение карточек товаров на главной странице', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    await inventoryPage.checkInventoryListVisible()
  })
  test('Просмотр карточки товара', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const itemPage = new ItemPage(page)
    await inventoryPage.goto()
    await inventoryPage.checkFirstItem(itemPage.getItemImg())
    await itemPage.checkButtonColor(true)
    await itemPage.clickButtonBackToProducts()
    await inventoryPage.textInTitleIsVisible('Products')
  })

  test('Добавление и проверка товаров в корзине', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    await inventoryPage.goto()
    await inventoryPage.checkCountShoppingCartBadge()
    const countItemsInCart = await inventoryPage.addProductsToCart()
    await inventoryPage.clickShoppingCart()
    await inventoryPage.textInTitleIsVisible('Your Cart')
    await cartPage.checkItemsInCart(
      inventoryPage.getProductLocators(),
      countItemsInCart
    )
  })

  test('Оформление заказа', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutStepOnePage = new CheckoutStepOnePage(page)
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page)
    const checkoutCompletePage = new CheckoutCompletePage(page)
    const itemPage = new ItemPage(page)
    await inventoryPage.goto()
    // Подготовка к оформлению
    const countItemsInCart = await inventoryPage.addProductsToCart()
    await inventoryPage.clickShoppingCart()
    // Начало оформления заказа
    await cartPage.clickCheckoutButton()
    await inventoryPage.textInTitleIsVisible('Checkout: Your Information')
    await checkoutStepOnePage.checkoutDataInput({
      firstName: 'Amy',
      lastName: 'Pond',
      postalCode: '260610',
    })
    await inventoryPage.textInTitleIsVisible('Checkout: Overview')
    await cartPage.checkItemsInCart(
      inventoryPage.getProductLocators(),
      countItemsInCart,
      false
    )
    await checkoutStepTwoPage.checkSummaryInfo()
    await checkoutStepTwoPage.checkSumOrder(inventoryPage.inventoryPrice)
    await checkoutStepTwoPage.clickFinishButton()
    await inventoryPage.textInTitleIsVisible('Checkout: Complete!')
    await checkoutCompletePage.checkCompletePage()
    await inventoryPage.checkCountShoppingCartBadge()
    await itemPage.checkButtonColor(false)
    await itemPage.clickButtonBackToProducts()
    await inventoryPage.checkInventoryListVisible()
  })

  test('Удаление товара из корзины', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    await inventoryPage.goto()
    // Подготовка к удалению
    let countItemsInCart = await inventoryPage.addProductsToCart()
    await inventoryPage.clickShoppingCart()
    // Начало удаления товара
    const firstItemInCart = await inventoryPage.getFirstNameItemInCart()
    countItemsInCart = await cartPage.removeItemInCart(countItemsInCart)
    await inventoryPage.checkCountShoppingCartBadge(countItemsInCart)
    const productLocators = inventoryPage.getProductLocators()
    await cartPage.checkCountItems(productLocators, countItemsInCart)
    await inventoryPage.checkFirstNameInCartNotContainText(firstItemInCart)
  })

  test('Валидация полей формы при оформлении заказа', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutStepOnePage = new CheckoutStepOnePage(page)
    await inventoryPage.goto()
    // Подготовка
    await inventoryPage.addProductsToCart()
    await inventoryPage.clickShoppingCart()
    await cartPage.clickCheckoutButton()
    // Начало валидации
    await checkoutStepOnePage.checkoutDataInput({
      firstName: '',
      lastName: '',
      postalCode: '',
    })
    await checkoutStepOnePage.checkErrorMessage('Error: First Name is required')
    await checkoutStepOnePage.checkoutDataInput({
      firstName: 'John',
      lastName: '',
      postalCode: '',
    })
    await checkoutStepOnePage.checkErrorMessage('Error: Last Name is required')
    await checkoutStepOnePage.checkoutDataInput({
      firstName: 'John',
      lastName: 'Smith',
      postalCode: '',
    })
    await checkoutStepOnePage.checkErrorMessage(
      'Error: Postal Code is required'
    )
    await checkoutStepOnePage.checkoutDataInput({
      firstName: 'John',
      lastName: 'Smith',
      postalCode: '123456',
    })
    await inventoryPage.textInTitleIsVisible('Checkout: Overview')
  })

  test('Сортировка товаров по возрастанию и убыванию цены', async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    // Подготовка к сортировке
    let originalPrices = await inventoryPage.getProductsPrices(
      inventoryPage.inventoryPrice
    )
    // Сортировка товаров по возрастанию
    let sortedByCodePrices = await inventoryPage.sortPrices(
      originalPrices,
      true
    )
    await inventoryPage.selectSort('Price (low to high)')
    let sortedByPagePrices = await inventoryPage.getProductsPrices(
      inventoryPage.inventoryPrice
    )
    expect(
      inventoryPage.arraysAreEqual(sortedByCodePrices, sortedByPagePrices)
    ).toBeTruthy()

    // Сортировка товаров по убыванию
    sortedByCodePrices = await inventoryPage.sortPrices(originalPrices, false)
    await inventoryPage.selectSort('Price (high to low)')
    sortedByPagePrices = await inventoryPage.getProductsPrices(
      inventoryPage.inventoryPrice
    )
    expect(
      inventoryPage.arraysAreEqual(sortedByCodePrices, sortedByPagePrices)
    ).toBeTruthy()
  })

  test('Проверка элементов меню', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    await inventoryPage.checkMenu()
  })

  test('Logout', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const logoutPage = new Logout(page)
    await inventoryPage.goto()
    await inventoryPage.logout()
    await logoutPage.checkAuthPage()
    await logoutPage.checkLoginButtonColor()
  })

  test('Валидация полей формы авторизации', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const logoutPage = new Logout(page)
    const checkoutStepOnePage = new CheckoutStepOnePage(page)
    await inventoryPage.goto()
    await inventoryPage.logout()
    await logoutPage.authDataInput({
      username: '',
      password: '',
    })
    await checkoutStepOnePage.checkErrorMessage(
      'Epic sadface: Username is required'
    )
    await logoutPage.authDataInput({
      username: 'standard_user',
      password: '',
    })
    await checkoutStepOnePage.checkErrorMessage(
      'Epic sadface: Password is required'
    )
    await logoutPage.authDataInput({
      username: 'testUsername',
      password: 'secret_sauce',
    })
    await checkoutStepOnePage.checkErrorMessage(
      'Epic sadface: Username and password do not match any user in this service'
    )
    await logoutPage.authDataInput({
      username: 'standard_user',
      password: 'testPassword',
    })
    await checkoutStepOnePage.checkErrorMessage(
      'Epic sadface: Username and password do not match any user in this service'
    )
  })
})
