import { expect, type Locator, type Page } from '@playwright/test'
import { colorLightGreen } from '../constants'

export default class Logout {
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator

  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.locator('[data-test="username"]')
    this.passwordInput = page.locator('[data-test="password"]')
    this.loginButton = page.locator('[data-test="login-button"]')
  }

  async checkAuthPage() {
    await expect(this.usernameInput).toBeVisible()
    await expect(this.passwordInput).toBeVisible()
    await expect(this.loginButton).toBeVisible()
  }

  async checkLoginButtonColor() {
    await expect(this.loginButton).toHaveCSS(
      'background-color',
      colorLightGreen
    )
  }

  async authDataInput({ username, password }) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }
}
