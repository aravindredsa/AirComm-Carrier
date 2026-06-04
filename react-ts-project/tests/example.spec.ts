import { expect, test } from '@playwright/test'

test('renders the ACP catalog experience', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'VIP Bidder catalog' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Apply filters' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'View iPhone 15 Pro' })).toBeVisible()
})

test('supports filtered search and detail navigation', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('Search products').fill('pixel')
  await page.getByRole('button', { name: 'Apply filters' }).click()

  await expect(page.getByRole('button', { name: 'View Google Pixel 8' })).toBeVisible()
  await page.getByRole('button', { name: 'View Google Pixel 8' }).click()

  await expect(
    page.getByRole('heading', { name: 'Google Pixel 8' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Back to catalog results' }).click()
  await expect(page.getByRole('button', { name: 'View Google Pixel 8' })).toBeVisible()
})
