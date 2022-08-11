// @ts-check
import { test, expect } from '@playwright/test'

const PAGE_URL = 'http://localhost:3000'

test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE_URL}/admin`)
    await expect(page).toHaveURL(`${PAGE_URL}/sign-in`)

    // await page.type('input[id="email"]', 'root') //, { delay: 100 })
    // await page.type('input[id="password"]', 'root') //, { delay: 100 })
    await page.locator('#email').fill('root')
    await page.locator('#password').fill('root')
    await page.click('text=Sign In')
    await expect(page).toHaveURL(`${PAGE_URL}/admin`)
})

test('admin-pages', async ({ page }) => {
    const TITLE = 'Secret Slug'
    const SLUG_P1 = 'my-very'
    const SLUG_P2 = 'secret-slug'

    await page.goto(`${PAGE_URL}/admin/pages`)

    await page.click('text=Create')

    await expect(page).toHaveURL(`${PAGE_URL}/admin/pages/create`)

    await page.locator('.ant-modal-footer :text("Cancel")').click()
    await expect(page).toHaveURL(`${PAGE_URL}/admin/pages`)

    await page.click('text=Create')
    await expect(page).toHaveURL(`${PAGE_URL}/admin/pages/create`)

    await page.locator('.ant-modal-body :text("Page")').click()
    await page.locator('.ant-modal-footer :text("OK")').click()

    await expect(page).toHaveURL(`${PAGE_URL}/admin/pages/create`)

    await page.locator('#title').fill(TITLE)
    await page.locator('.ant-checkbox-group :text("Admin")').click()
    await page.locator('.ant-checkbox-group :text("User")').click()
    // await page.click(':text("Admin")')
    // await page.click(':text("User")')

    // await page.locator('#slug-0').fill(SLUG_P2)
    await page.locator('#slug-plus').click()
    await page.locator('#slug-plus').click()
    await page.locator('#slug-0').fill('no-no-no')
    await page.locator('#slug-1').fill(SLUG_P1)
    await page.locator('#slug-minus').click()

    await page.click(':text("Save")')
    await expect(page).toHaveURL(`${PAGE_URL}/admin/pages`)
    await page.goto(`${PAGE_URL}/${SLUG_P1}/${SLUG_P2}`)
})

test.afterEach(async ({ page }) => {
    const name = await page.innerText('.logged-username')

    expect(name).toBe('root')
    const handle = await page.$('.logged-username')
    await handle?.hover()

    await page.click('text=Disconnect')
})
// test.beforeEach(async ({ page }) => {
//     await page.goto('http://localhost:3000/')
//     // await page.click('text=Login')
//     await page.type('input[name="email"]', 'antoine@mediasia-interactive.com')
//     await page.type('input[name="password"]', '28YuYaoRoad', { delay: 100 })
//     await page.click('text=Se connecter')
// })

// test.beforeEach(async ({ page }) => {
//     await page.goto('http://localhost:3000/')
// })

// test('dashboard', async ({ page }) => {
//     await page.click('text=Tableau de bord')
// })

// test('park-managment', async ({ page }) => {
//     await page.click('text=Gestion du parc')
// })

// test('guarding', async ({ page }) => {
//     await page.click('text=Gardiennage')
// })

// test('invoices', async ({ page }) => {
//     await page.click('text=Factures')
// })

// test('users', async ({ page }) => {
//     await page.click('text=Utilisateurs')

//     await page.type('input[name="search"]', 'alexandre', { delay: 100 })
//     await page.click('.icon-search')
//     await page.click('text=| Suivant »')
// await expect(page).toHaveURL('http://localhost:3000/about')
// await expect(page.locator('h1')).toContainText('About Page')
// })
