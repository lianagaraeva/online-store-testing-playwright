import { expect, type Locator, type Page } from '@playwright/test'

const countItemsInPage = 6
export default class InventoryPage {
  readonly page: Page
  readonly inventoryList: Locator
  readonly inventoryImg: Locator
  readonly inventoryListName: Locator
  readonly inventoryDescription: Locator
  readonly inventoryPrice: Locator
  readonly buttonAddToCart: Locator
  readonly firstItemName: Locator
  readonly titleProducts: Locator

  constructor(page: Page) {
    this.page = page
    this.inventoryList = page.locator('[data-test="inventory-item"]')
    this.inventoryImg = page.locator('img.inventory_item_img')
    this.inventoryListName = page.locator('[data-test="inventory-item-name"]')
    this.inventoryDescription = page.locator(
      '[data-test="inventory-item-desc"]'
    )
    this.inventoryPrice = page.locator('[data-test="inventory-item-price"]')
    this.buttonAddToCart = page.locator(
      '.btn.btn_primary.btn_small.btn_inventory'
    )
    this.firstItemName = page.locator('[data-test="item-4-title-link"]')
    this.titleProducts = page.locator('[data-test="title"]')
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html')
  }

  async checkInventoryListVisible() {
    await expect(this.inventoryList).toHaveCount(countItemsInPage)
    await expect(this.inventoryImg).toHaveCount(countItemsInPage)
    await expect(this.inventoryListName).toHaveCount(countItemsInPage)
    await expect(this.inventoryDescription).toHaveCount(countItemsInPage)
    await expect(this.inventoryPrice).toHaveCount(countItemsInPage)
    await expect(this.buttonAddToCart).toHaveCount(countItemsInPage)

    for (var index = 0; index < countItemsInPage; index++) {
      const elementImg = this.inventoryImg.nth(index)
      const elementName = this.inventoryListName.nth(index)
      const elementDescription = this.inventoryDescription.nth(index)
      const elementPrice = this.inventoryPrice.nth(index)
      const elementButton = this.buttonAddToCart.nth(index)

      this.checkCard(
        elementImg,
        elementName,
        elementDescription,
        elementPrice,
        elementButton
      )
    }
  }

  async checkCard(img, name, description, price, button, isFullCard = false) {
    await expect(img).toHaveAttribute('src', /.*/)
    await expect(name).not.toBeEmpty()
    await expect(name).toHaveCSS(
      'color',
      isFullCard ? 'rgb(19, 35, 34)' : 'rgb(24, 88, 58)'
    )
    await expect(description).not.toBeEmpty()
    await expect(price).toHaveText(/$/)
    await expect(button).toHaveText(/Add to cart/)
  }

  async checkFirstItem(itemImg) {
    await this.firstItemName.click()
    await this.checkCard(
      itemImg,
      this.inventoryListName,
      this.inventoryDescription,
      this.inventoryPrice,
      this.buttonAddToCart,
      true
    )
  }
  async titleProductsIsVisible() {
    await expect(this.titleProducts).toBeVisible()
  }
}
