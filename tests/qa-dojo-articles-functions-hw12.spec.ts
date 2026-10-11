import { test, expect } from '@playwright/test';
import { agreeToTermsReg, fillConfirmPasswordReg, fillEmailLogin, fillEmailReg, fillPasswordLogin, fillPasswordReg, fillUsernameReg, submitLogin, submitLoginForm, submitReg, submitRegistrationForm } from './qa-dojo-articles-functions-page-actions-hw12'

test.describe('Registration', { tag: '@hw12:functions' }, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/articles/register');
    });

    test('REG1: New User Registered Success Test', async ({ page }) => {
        const username = `aqa_${Date.now()}`;
        const email = `aqa_${Date.now()}@mail.com`;
        const password = `qwerty123`;

        const userProfile_Header = page.getByTestId('nav-profile');
        const feedTab_Articles = page.getByTestId('feed-tab-your');

        await fillUsernameReg(page, username);
        await fillEmailReg(page, email);
        await fillPasswordReg(page, password);
        await fillConfirmPasswordReg(page, password);
        await agreeToTermsReg(page);
        await submitReg(page);

        await expect(userProfile_Header).toBeVisible();
        await expect(userProfile_Header).toContainText(username);
        await expect(feedTab_Articles).toContainText('Your feed');
    });

    test('REG2: Email already exists Validation Test', async ({ page }) => {
        const username = `Olena`;
        const email = `olena@example.com`;
        const password = `qwerty123`;

        const errorAlert_Reg = page.getByTestId('error-messages')
        const userExistsErrorMsg_Reg = 'body email або username вже зайняті'

        await submitRegistrationForm(page, username, email, password);
        await expect(errorAlert_Reg).toBeVisible();
        await expect(errorAlert_Reg).toContainText(userExistsErrorMsg_Reg);
    })

    test('REG3: Username less than 3 chars Validation Test', async ({ page }) => {
        const username = `Ol`;
        const email = `olena@example.com`;
        const password = `qwerty123`;

        const errorAlert_Reg = page.getByTestId('error-messages')
        const tooShortErrorMsg_Reg = 'username ім\'я має містити щонайменше 3 символи'

        await submitRegistrationForm(page, username, email, password);
        await expect(errorAlert_Reg).toBeVisible();
        await expect(errorAlert_Reg).toContainText(tooShortErrorMsg_Reg);
    });
});

test.describe('Login', { tag: '@hw12:functions' }, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/articles/login');
    });

    test('LOG1: User Logged in Success Test', async ({ page }) => {
        const email = `olena@example.com`;
        const password = `password`;

        const userProfile_Header = page.getByTestId('nav-profile');
        const feedTab_Articles = page.getByTestId('feed-tab-your');

        await fillEmailLogin(page, email);
        await fillPasswordLogin(page, password);
        await submitLogin(page);

        await expect(userProfile_Header).toBeVisible();
        await expect(userProfile_Header).toContainText('olena');
        await expect(feedTab_Articles).toBeVisible();
    });

    test('LOG2: Invalid Password Submitted Validation Test', async ({ page }) => {
        const email = `olena@example.com`;
        const password = `password_invalid`;

        const errorAlert_Login = page.getByTestId('error-messages');
        const incorrectCredsErrorMsg_Login = 'email or password неправильні'

        await submitLoginForm(page, email, password)
        await expect(errorAlert_Login).toBeVisible();
        await expect(errorAlert_Login).toContainText(incorrectCredsErrorMsg_Login);
    });

    test('LOG3: Non-existing User Validation Test', async ({ page }) => {
        const email = `olena2@example.com`;
        const password = `password`;

        const errorAlert_Login = page.getByTestId('error-messages');
        const incorrectCredsErrorMsg_Login = 'email or password неправильні'

        await submitLoginForm(page, email, password)
        await expect(errorAlert_Login).toBeVisible();
        await expect(errorAlert_Login).toContainText(incorrectCredsErrorMsg_Login);
    })
})