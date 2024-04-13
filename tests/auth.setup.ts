import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('https://www.saucedemo.com')
  await page.locator('input[id=user-name]').fill('standard_user')
  await page.locator('input[id=password]').fill('secret_sauce')
  await page.locator('input[id=login-button]').click()

  await page.waitForURL('https://www.saucedemo.com/inventory.html')
  await expect(page.locator('.app_logo')).toBeVisible()
  await page.context().storageState({ path: authFile })
})
