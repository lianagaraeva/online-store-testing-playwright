import { type Locator, type Page } from '@playwright/test'

export default class ItemPage {
  readonly page: Page
  readonly buttonBackToProducts: Locator
  readonly itemImg: Locator

  constructor(page: Page) {
    this.page = page
    this.itemImg = page.locator('.inventory_details_img')
    this.buttonBackToProducts = page.locator('[data-test="back-to-products"]')
  }
  async getItemImg() {
    return await this.itemImg
  }
  async clickButtonBackToProducts() {
    await this.buttonBackToProducts.click()
  }
}
