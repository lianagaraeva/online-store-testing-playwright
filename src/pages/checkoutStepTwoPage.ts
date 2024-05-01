import { expect, type Locator, type Page } from '@playwright/test'

export default class CheckoutStepTwoPage {
  readonly page: Page
  readonly paymentInfoLabel: Locator
  readonly paymentInfoValue: Locator
  readonly shippingInfoLabel: Locator
  readonly shippingInfoValue: Locator
  readonly totalInfoLabel: Locator
  readonly subtotalLabel: Locator
  readonly taxLabel: Locator
  readonly totalLabel: Locator
  readonly finishButton: Locator
  readonly cancelButton: Locator

  constructor(page: Page) {
    this.page = page
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]')
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]')
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]')
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]')
    this.totalInfoLabel = page.locator('[data-test="total-info-label"]')
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]')
    this.taxLabel = page.locator('[data-test="tax-label"]')
    this.totalLabel = page.locator('[data-test="total-label"]')

    this.finishButton = page.locator('[data-test="finish"]')
    this.cancelButton = page.locator('[data-test="cancel"]')
  }

  async checkSummaryInfo() {
    await expect(this.paymentInfoLabel).toBeVisible()
    await expect(this.paymentInfoValue).toBeVisible()
    await expect(this.shippingInfoLabel).toBeVisible()
    await expect(this.shippingInfoValue).toBeVisible()
    await expect(this.totalInfoLabel).toBeVisible()
    await expect(this.subtotalLabel).toBeVisible()
    await expect(this.taxLabel).toBeVisible()
    await expect(this.totalLabel).toBeVisible()
  }

  async checkSumOrder(inventoryPrice: Locator) {
    // sum - стоимость, полученная с помощью метода getSumProducts
    const sum = await this.getSumProducts(inventoryPrice)

    // itemTotal - стоимость, отображающаяся на странице
    let itemTotal = await this.subtotalLabel.innerText()
    itemTotal = itemTotal.replace('Item total: $', '')
    expect(+itemTotal).toEqual(sum)

    // tax - налог
    let tax = await this.taxLabel.innerText()
    tax = tax.replace('Tax: $', '')

    // totalPrice - полная стоимость: itemTotal + tax
    let totalPrice = await this.totalLabel.innerText()
    totalPrice = totalPrice.replace('Total: $', '')
    expect(+itemTotal + +tax).toEqual(+totalPrice)
  }

  // Проходимся по массиву локаторов inventoryPrice
  async getSumProducts(priceList: Locator) {
    let sum = 0
    for (let index = 0; index < (await priceList.count()); index++) {
      const price = priceList.nth(index)
      const priceText = await price.innerText()
      sum += +priceText.replace('$', '')
    }
    return sum
  }

  async clickFinishButton() {
    await this.finishButton.click()
  }
}
