import { test, expect } from '@playwright/test'
import InventoryPage from '../pages/inventoryPage'
import ItemPage from '../pages/itemPage'
import CartPage from '../pages/cartPage'
import CheckoutStepOnePage from '../pages/checkoutStepOnePage'
import CheckoutStepTwoPage from '../pages/checkoutStepTwoPage'
import CheckoutCompletePage from '../pages/checkoutCompletePage'
import Logout from '../pages/logoutPage'

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

  test('Валидация полей формы при оформлении заказа', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutStepOnePage = new CheckoutStepOnePage(page)
    await inventoryPage.goto()
    await inventoryPage.addProductsToCart()
    await inventoryPage.clickShoppingCart()
    await cartPage.clickCheckoutButton()
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

  test('Сортировка товаров по цене', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    const originalPrices = await inventoryPage.getProductsPrices(
      inventoryPage.inventoryPrice
    )
    const sortedByCodePrices = await inventoryPage.sortPricesAsc(originalPrices)
    await inventoryPage.selectSort('Price (low to high)')
    const sortedByPagePrices = await inventoryPage.getProductsPrices(
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
})
