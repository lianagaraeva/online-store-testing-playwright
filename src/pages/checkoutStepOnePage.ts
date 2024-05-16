import { expect, type Locator, type Page } from '@playwright/test'

export default class CheckoutStepOnePage {
  readonly page: Page
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly postalCodeInput: Locator
  readonly continueButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.firstNameInput = page.locator('[data-test="firstName"]')
    this.lastNameInput = page.locator('[data-test="lastName"]')
    this.postalCodeInput = page.locator('[data-test="postalCode"]')
    this.continueButton = page.locator('[data-test="continue"]')
    this.errorMessage = page.locator('[data-test="error"]')
  }

  async checkoutDataInput({ firstName = '', lastName = '', postalCode = '' }) {
    // условный вызов заполнения полей
    // заполняем поле, если входные параметры не пустые
    firstName && (await this.firstNameInput.fill(firstName))
    lastName && (await this.lastNameInput.fill(lastName))
    postalCode && (await this.postalCodeInput.fill(postalCode))
    await this.continueButton.click()
  }

  async checkErrorMessage(text: string) {
    await expect(this.errorMessage).toHaveText(text)
  }
}
