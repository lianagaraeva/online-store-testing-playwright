import { type Locator, type Page } from '@playwright/test'

export default class CheckoutStepOnePage {
  readonly page: Page
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly postalCodeInput: Locator
  readonly continueButton: Locator

  constructor(page: Page) {
    this.page = page
    this.firstNameInput = page.locator('[data-test="firstName"]')
    this.lastNameInput = page.locator('[data-test="lastName"]')
    this.postalCodeInput = page.locator('[data-test="postalCode"]')
    this.continueButton = page.locator('[data-test="continue"]')
  }

  async checkoutDataInput({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.postalCodeInput.fill(postalCode)
    await this.continueButton.click()
  }
}
