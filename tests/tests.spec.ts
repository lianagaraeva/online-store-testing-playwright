import { test, expect } from '@playwright/test'
import InventoryPage from '../pages/inventoryPage'
import ItemPage from '../pages/itemPage'
import CartPage from '../pages/cartPage'

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
    await inventoryPage.checkFirstItem(await itemPage.getItemImg())
    await itemPage.clickButtonBackToProducts()
    await inventoryPage.titleProductsIsVisible()
  })

  test('Добавление товара в корзину из списка товаров и из карточки товара', async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    await inventoryPage.addToCart()
  })

  test('Проверка элементов меню', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    await inventoryPage.checkMenu()
  })
})
