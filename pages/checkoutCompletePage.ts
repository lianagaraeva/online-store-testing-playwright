import { expect, type Locator, type Page } from '@playwright/test'

export default class CheckoutCompletePage {
  readonly page: Page
  readonly checkMarkImage: Locator
  readonly completeHeader: Locator
  readonly completeText: Locator
  // title взять из InventoryPage
  // button [Back Home] взять из ItemPage

  constructor(page: Page) {
    this.page = page
    this.checkMarkImage = page.locator('[data-test="pony-express"]')
    this.completeHeader = page.locator('[data-test="complete-header"]')
    this.completeText = page.locator('[data-test="complete-text"]')
  }

  async checkCompletePage() {
    await expect(this.checkMarkImage).toBeVisible()
    await expect(this.completeHeader).toBeVisible()
    await expect(this.completeText).toBeVisible()
  }
}
