import { expect, type Locator, type Page } from '@playwright/test'
import { colorWhite, colorLightGreen } from '../constants'

export default class ItemPage {
  readonly page: Page
  readonly buttonBackToProducts: Locator
  readonly itemImg: Locator

  constructor(page: Page) {
    this.page = page
    this.itemImg = page.locator('.inventory_details_img')
    this.buttonBackToProducts = page.locator('[data-test="back-to-products"]')
  }
  getItemImg() {
    return this.itemImg
  }
  async clickButtonBackToProducts() {
    await this.buttonBackToProducts.click()
  }
  async checkButtonColor({ isFullCard = true } = {}) {
    await expect(this.buttonBackToProducts).toHaveCSS(
      'background-color',
      isFullCard ? colorWhite : colorLightGreen
    )
  }
}
