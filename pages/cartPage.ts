import { type Locator, type Page } from '@playwright/test'

export default class CartPage {
  readonly page: Page
  readonly shoppingCart: Locator

  constructor(page: Page) {
    this.page = page
    this.shoppingCart = page.locator('[data-test="shopping-cart-link"]')
  }
}
