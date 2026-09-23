import {test,expect} from '@playwright/test'; 

test.describe('Registration', {tag: '@auth'} , () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/articles/register');
    });

    test('REG1: New User Registered Success Test' , async ({ page }) => {
        const username = `aqa_${Date.now()}`;
        const email = `aqa_${Date.now()}@mail.com`;
        const password = `qwerty123`;

        await page.getByTestId('auth-username').fill(username);
        await page.getByTestId('auth-email').fill(email);
        await page.getByTestId('auth-password').fill(password);
        await page.getByTestId('register-confirm-password').fill(password);
        await page.getByTestId('register-terms').check();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('nav-profile')).toBeVisible();
        await expect(page.getByTestId('nav-profile')).toContainText(username);
        await expect(page.getByTestId('feed-tab-your')).toContainText('Your feed');
    });

    test('REG2: Email already exists Validation Test' , async ({ page }) => {
        const username = `Olena`;
        const email = `olena@example.com`;
        const password = `qwerty123`;

        await page.getByTestId('auth-username').fill(username);
        await page.getByTestId('auth-email').fill(email);
        await page.getByTestId('auth-password').fill(password);
        await page.getByTestId('register-confirm-password').fill(password);
        await page.getByTestId('register-terms').check();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByText('body email або username')).toBeVisible();
        await expect(page.getByTestId('error-messages').getByRole('paragraph')).toContainText('body email або username вже зайняті');
    });

    test('REG3: Username less than 3 chars Validation Test' , async ({ page }) => {
        const username = `Ol`;
        const email = `olena@example.com`;
        const password = `qwerty123`;

        await page.getByTestId('auth-username').fill(username);
        await page.getByTestId('auth-email').fill(email);
        await page.getByTestId('auth-password').fill(password);
        await page.getByTestId('register-confirm-password').fill(password);
        await page.getByTestId('register-terms').check();
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('error-messages').getByText('username')).toBeVisible();
        await expect(page.getByTestId('error-messages').getByRole('paragraph')).toContainText('username ім\'я має містити щонайменше 3 символи');

    })

});

test.describe('Login', {tag: '@auth'} , () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/articles/login');
    });

    test('LOG1: User Logged in Success Test' , async ({ page }) => {
        const email = `olena@example.com`;
        const password = `password`;

        await page.getByTestId('auth-email').fill(email);
        await page.getByTestId('auth-password').fill(password);
        await page.getByTestId('auth-submit').click();
        await expect(page.getByTestId('nav-profile')).toBeVisible();
        await expect(page.getByTestId('nav-profile')).toContainText('olena');
        await expect(page.getByTestId('feed-tab-your')).toBeVisible();
    });

    test('LOG2: Invalid Password Submitted Validation Test' , async ({ page }) => {
        const email = `olena@example.com`;
        const password = `password_invalid`;

        await page.getByTestId('auth-email').fill(email);
        await page.getByTestId('auth-password').fill(password);
        await page.getByTestId('auth-submit').click();
        await expect(page.getByText('email or password неправильні')).toBeVisible();
        await expect(page.getByTestId('error-messages').getByRole('paragraph')).toContainText('email or password неправильні');
    });

     test('LOG3: Non-existing User Validation Test' , async ({ page }) => {
        const email = `olena2@example.com`;
        const password = `password`;

        await page.getByTestId('auth-email').fill(email);
        await page.getByTestId('auth-password').fill(password);
        await page.getByTestId('auth-submit').click();
        await expect(page.getByText('email or password неправильні')).toBeVisible();
        await expect(page.getByTestId('error-messages').getByRole('paragraph')).toContainText('email or password неправильні');
    })
})