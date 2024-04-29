import { expect, type Locator, type Page } from '@playwright/test'
import { colorGreen } from '../constants'
import { getCountClicksByButton } from '../helpers'

export default class CartPage {
  readonly page: Page
  readonly itemQuantity: Locator
  readonly removeButtonInCart: Locator
  readonly checkoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.itemQuantity = page.locator('[data-test="item-quantity"]')
    this.removeButtonInCart = page.locator(
      '.btn.btn_secondary.btn_small.cart_button'
    )
    this.checkoutButton = page.locator('[data-test="checkout"]')
  }

  async checkCountItems(
    { inventoryList, inventoryListName, inventoryDescription, inventoryPrice },
    countItemsInCart,
    isCartPage = true
  ) {
    await expect(inventoryList).toHaveCount(countItemsInCart)
    await expect(inventoryListName).toHaveCount(countItemsInCart)
    await expect(inventoryDescription).toHaveCount(countItemsInCart)
    await expect(inventoryPrice).toHaveCount(countItemsInCart)
    if (isCartPage) {
      await expect(this.removeButtonInCart).toHaveCount(countItemsInCart)
    }
    await expect(this.itemQuantity).toHaveCount(countItemsInCart)
  }

  async checkItemsInCart(productLocators, countItemsInCart, isCartPage = true) {
    const {
      inventoryList,
      inventoryListName,
      inventoryDescription,
      inventoryPrice,
    } = productLocators

    await this.checkCountItems(
      {
        inventoryList,
        inventoryListName,
        inventoryDescription,
        inventoryPrice,
      },
      countItemsInCart,
      isCartPage
    )
    for (let index = 0; index < countItemsInCart; index++) {
      const name = inventoryListName.nth(index)
      const description = inventoryDescription.nth(index)
      const price = inventoryPrice.nth(index)
      const button = this.removeButtonInCart.nth(index)
      const quantity = this.itemQuantity.nth(index)

      await this.checkCart(
        name,
        description,
        price,
        button,
        quantity,
        isCartPage
      )
    }
  }

  async checkCart(name, description, price, button, quantity, isCartPage) {
    await expect(quantity).toHaveText(/1/)
    await expect(name).not.toBeEmpty()
    await expect(name).toHaveCSS('color', colorGreen)
    await expect(description).not.toBeEmpty()
    await expect(price).toHaveText(/$/)
    if (isCartPage) {
      await expect(button).toHaveText(/Remove/)
    }
  }

  async clickCheckoutButton() {
    await this.checkoutButton.click()
  }

  async removeItemInCart(countItemsInCart) {
    return getCountClicksByButton(
      this.removeButtonInCart.first(),
      countItemsInCart,
      false
    )
  }
}
