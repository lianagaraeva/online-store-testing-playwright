import { Locator } from '@playwright/test'
/**
 * Кликает по кнопке и возвращает количество товаров в корзине после клика добавить, либо удалить
 * @param button - локатор кнопки добавления, либо удаления
 * @param countItemsInCart - количество товаров в корзине
 * @param isAddToCartButton - true - если кнопка "Добавить", false - если кнопка "Удалить"
 * @returns
 */
export async function getCountClicksByButton(
  button: Locator,
  countItemsInCart: number,
  isAddToCartButton: boolean
): Promise<number> {
  await button.click()
  if (isAddToCartButton == true) {
    return ++countItemsInCart
  } else {
    return --countItemsInCart
  }
}
