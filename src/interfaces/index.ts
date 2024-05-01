import { Locator } from '@playwright/test'

export interface ProductLocators {
  inventoryList: Locator
  inventoryListName: Locator
  inventoryDescription: Locator
  inventoryPrice: Locator
  removeButton: Locator
}
