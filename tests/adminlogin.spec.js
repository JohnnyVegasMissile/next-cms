// @ts-check
import { test, expect } from '@playwright/test'

test('admin', async ({ page }) => {
    await page.goto('http://localhost:8080/admin/pages')

    await expect(page).toHaveURL('http://localhost:8080/signin')

    await page.type('input[name="email"]', 'root') //, { delay: 100 })
    await page.type('input[name="password"]', 'root') //, { delay: 100 })

    await page.click('text=Sign In')

    await expect(page).toHaveURL('http://localhost:8080/admin/pages')

    const name = await page.innerText('.logged-username')

    expect(name).toBe('root')
    const handle = await page.$('.logged-username')
    await handle?.hover()

    await page.click('text=Disconnect')

    await expect(page).toHaveURL('http://localhost:8080/signin')
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

// test.afterAll(async ({ page }) => {
//     // await page.goto('http://localhost:3000/account')
//     await page.click('.user-info-wrap')
//     await page.click('text=Déconnexion')
//     await page.close()
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
