import { test, expect } from '@playwright/test'
import InventoryPage from '../pages/inventoryPage'

test.describe('Разработка E2E тестов для интернет-магазина с помощью Playwright', async () => {
  test('Отображение карточек товаров на главной странице', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    await inventoryPage.checkInventoryListVisible()
  })
})
