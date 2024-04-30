import { expect, type Locator, type Page } from '@playwright/test'
import { colorBlack, colorGreen, colorRed } from '../constants'
import { getCountClicksByButton } from '../helpers'

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
  readonly title: Locator
  readonly burgerMenuButton: Locator
  readonly menuItem: Locator
  readonly closeMenuButton: Locator
  readonly shoppingCartBadge: Locator
  readonly firstAddToCartButton: Locator
  readonly firstRemoveButton: Locator
  readonly shoppingCart: Locator
  readonly productSort: Locator

  constructor(page: Page) {
    this.page = page

    /* ------------ Отображение карточек товаров на главной странице ------------ */
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

    /* ------------------------ Просмотр карточки товара ------------------------ */
    this.firstItemName = page.locator('[data-test="item-4-title-link"]')
    this.secondItemName = page.locator('[data-test="item-0-title-link"]')
    this.removeButton = page.locator(
      '.btn.btn_secondary.btn_small.btn_inventory'
    )
    this.title = page.locator('[data-test="title"]')
    this.burgerMenuButton = page.locator('#react-burger-menu-btn')
    this.menuItem = page.locator('.bm-item.menu-item')
    this.closeMenuButton = page.locator('#react-burger-cross-btn')
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]')

    /* --- Добавление товара в корзину из списка товаров и из карточки товара --- */
    this.firstAddToCartButton = this.addToCartButton.first()
    this.firstRemoveButton = this.removeButton.first()
    this.shoppingCart = page.locator('[data-test="shopping-cart-link"]')

    /* ------------------------------- Сортировка ------------------------------- */
    this.productSort = page.locator('[data-test="product-sort-container"]')
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html')
  }

  /* ------------ Отображение карточек товаров на главной странице ------------ */
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

      await this.checkCard(
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
    await expect(name).toHaveCSS('color', isFullCard ? colorBlack : colorGreen)
    await expect(description).not.toBeEmpty()
    await expect(price).toHaveText(/$/)
    await expect(button).toHaveText(/Add to cart/)
  }

  /* ------------------------ Просмотр карточки товара ------------------------ */
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
  async textInTitleIsVisible(text) {
    await expect(this.title).toHaveText(text)
  }

  /* --- Добавление товара в корзину из списка товаров и из карточки товара --- */
  async addProductsToCart() {
    let countItemsInCart = 0
    await expect(this.firstAddToCartButton).toHaveCSS('color', colorBlack)
    countItemsInCart = await getCountClicksByButton(
      this.firstAddToCartButton,
      countItemsInCart,
      true
    )
    await expect(this.firstRemoveButton).toBeVisible()
    await expect(this.firstRemoveButton).toHaveCSS('color', colorRed)
    await this.checkCountShoppingCartBadge(countItemsInCart)
    await expect(this.shoppingCartBadge).toHaveCSS('background-color', colorRed)
    await this.secondItemName.click()
    countItemsInCart = await getCountClicksByButton(
      this.addToCartButton,
      countItemsInCart,
      true
    )
    await this.checkCountShoppingCartBadge(countItemsInCart)
    return countItemsInCart
  }

  async checkCountShoppingCartBadge(count: number | null = null) {
    if (count !== null && count > 0) {
      await expect(this.shoppingCartBadge).toHaveText(`${count}`)
    } else {
      await expect(this.shoppingCartBadge).not.toBeVisible()
    }
  }

  async clickShoppingCart() {
    await this.shoppingCart.click()
  }

  getProductLocators() {
    const productLocators = {
      inventoryList: this.inventoryList,
      inventoryListName: this.inventoryListName,
      inventoryDescription: this.inventoryDescription,
      inventoryPrice: this.inventoryPrice,
      removeButton: this.removeButton,
    }
    return productLocators
  }

  /* -------------------------------- Удаление -------------------------------- */
  async getFirstNameItemInCart() {
    return this.inventoryListName.first().innerText()
  }

  async checkFirstNameInCartNotContainText(text) {
    await expect(this.inventoryListName.first()).not.toContainText(text)
  }

  /* ------------------------------- Сортировка ------------------------------- */
  sortPrices(prices, isAsc) {
    return prices.sort((a, b) => (isAsc ? a - b : b - a))
  }

  async getProductsPrices(priceList) {
    let unsortedPrices: number[] = []
    for (let index = 0; index < (await priceList.count()); index++) {
      const price = priceList.nth(index)
      const priceText = await price.innerText()
      unsortedPrices.push(+priceText.replace('$', ''))
    }
    return unsortedPrices
  }

  arraysAreEqual(arr1, arr2) {
    if (arr1.length != arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i]) return false
    }
    return true
  }

  async selectSort(text) {
    await this.productSort.selectOption(text)
  }

  /* ------------------------- Проверка элементов меню ------------------------ */
  async checkMenu() {
    await this.burgerMenuButton.click()

    await expect(this.menuItem).toHaveCount(4)
    for (let index = 0; index < countMenuItems; index++) {
      const elementMenuItem = this.menuItem.nth(index)
      this.checkMenuItem(elementMenuItem)
    }

    await this.closeMenuButton.click()
  }

  private async checkMenuItem(elementMenuItem) {
    await expect(elementMenuItem).toHaveAttribute('href', /.*/)
    await expect(elementMenuItem).toHaveCSS('color', colorGreen)
  }

  /* --------------------------------- Logout --------------------------------- */
  async logout() {
    await this.burgerMenuButton.click()
    await this.menuItem.nth(2).click()
  }
}
