import { expect, type Locator, type Page } from '@playwright/test'

const countItemsInPage = 6
const countMenuItems = 4
export default class InventoryPage {
  readonly page: Page
  readonly inventoryList: Locator
  readonly inventoryImg: Locator
  readonly inventoryListName: Locator
  readonly inventoryDescription: Locator
  readonly inventoryPrice: Locator
  readonly addToCartButton: Locator
  readonly firstItemName: Locator
  readonly secondItemName: Locator
  readonly removeButton: Locator
  readonly titleProducts: Locator
  readonly burgerMenuButton: Locator
  readonly menuItem: Locator
  readonly closeMenuButton: Locator
  readonly shoppingCartBadge: Locator
  readonly firstAddToCartButton: Locator
  readonly firstRemoveButton: Locator

  constructor(page: Page) {
    this.page = page
    this.inventoryList = page.locator('[data-test="inventory-item"]')
    this.inventoryImg = page.locator('img.inventory_item_img')
    this.inventoryListName = page.locator('[data-test="inventory-item-name"]')
    this.inventoryDescription = page.locator(
      '[data-test="inventory-item-desc"]'
    )
    this.inventoryPrice = page.locator('[data-test="inventory-item-price"]')
    this.addToCartButton = page.locator(
      '.btn.btn_primary.btn_small.btn_inventory'
    )
    this.firstItemName = page.locator('[data-test="item-4-title-link"]')
    this.secondItemName = page.locator('[data-test="item-0-title-link"]')
    this.removeButton = page.locator(
      '.btn.btn_secondary.btn_small.btn_inventory'
    )
    this.titleProducts = page.locator('[data-test="title"]')
    this.burgerMenuButton = page.locator('#react-burger-menu-btn')
    this.menuItem = page.locator('.bm-item.menu-item')
    this.closeMenuButton = page.locator('#react-burger-cross-btn')
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]')
    this.firstAddToCartButton = this.addToCartButton.first()
    this.firstRemoveButton = this.removeButton.first()
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
    await expect(this.addToCartButton).toHaveCount(countItemsInPage)

    for (let index = 0; index < countItemsInPage; index++) {
      const elementImg = this.inventoryImg.nth(index)
      const elementName = this.inventoryListName.nth(index)
      const elementDescription = this.inventoryDescription.nth(index)
      const elementPrice = this.inventoryPrice.nth(index)
      const elementButton = this.addToCartButton.nth(index)

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
      this.addToCartButton,
      true
    )
  }
  async titleProductsIsVisible() {
    await expect(this.titleProducts).toBeVisible()
  }

  async addToCart() {
    // проверили, что цвет кнопки - чёрный
    await expect(this.firstAddToCartButton).toHaveCSS(
      'color',
      'rgb(19, 35, 34)'
    )
    await this.firstAddToCartButton.click()
    await expect(this.firstRemoveButton).toBeVisible()
    // проверили, что цвет кнопки - красный
    await expect(this.firstRemoveButton).toHaveCSS('color', 'rgb(226, 35, 26)')
    await expect(this.shoppingCartBadge).toHaveText(/1/)
    // проверили, что цвет бэйджа корзины - красный
    await expect(this.shoppingCartBadge).toHaveCSS(
      'background-color',
      'rgb(226, 35, 26)'
    )
    await this.secondItemName.click()
    await this.addToCartButton.click()
    await expect(this.shoppingCartBadge).toHaveText(/2/)
  }
  async checkMenu() {
    await expect(this.burgerMenuButton).toBeVisible()
    await this.burgerMenuButton.click()
    await expect(this.burgerMenuButton).not.toBeVisible()

    await expect(this.menuItem).toHaveCount(4)
    for (let index = 0; index < countMenuItems; index++) {
      const elementMenuItem = this.menuItem.nth(index)
      this.checkMenuItem(elementMenuItem)
    }

    await this.closeMenuButton.click()
    await expect(this.burgerMenuButton).toBeVisible()
  }

  private async checkMenuItem(elementMenuItem) {
    await expect(elementMenuItem).toHaveAttribute('href', /.*/)
    await expect(elementMenuItem).toHaveCSS('color', 'rgb(24, 88, 58)')
  }
}
