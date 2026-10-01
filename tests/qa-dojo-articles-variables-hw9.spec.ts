import { test, expect } from '@playwright/test';

test.describe('Registration', { tag: '@hw9:variables' }, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/articles/register');
    });

    test('REG1: New User Registered Success Test', async ({ page }) => {
        let username = `aqa_${Date.now()}`;
        let email = `aqa_${Date.now()}@mail.com`;
        let password = `qwerty123`;

        const usernameInput_Reg = page.getByTestId('auth-username');
        const emailInput_Reg = page.getByTestId('auth-email');
        const passwordInput_Reg = page.getByTestId('auth-password');
        const passwordConfirmInput_Reg = page.getByTestId('register-confirm-password');
        const agreeToTermsChbox_Reg = page.getByTestId('register-terms');
        const createAccountBtn_Reg = page.getByTestId('auth-submit');
        const userProfile_Header = page.getByTestId('nav-profile');
        const feedTab_Articles = page.getByTestId('feed-tab-your');

        await usernameInput_Reg.fill(username);
        await emailInput_Reg.fill(email);
        await passwordInput_Reg.fill(password);
        await passwordConfirmInput_Reg.fill(password);
        await agreeToTermsChbox_Reg.check();
        await createAccountBtn_Reg.click();
        await expect(userProfile_Header).toBeVisible();
        await expect(userProfile_Header).toContainText(username);
        await expect(feedTab_Articles).toContainText('Your feed');
    });

    test('REG2: Email already exists Validation Test', async ({ page }) => {
        let username = `Olena`;
        let email = `olena@example.com`;
        let password = `qwerty123`;

        const usernameInput_Reg = page.getByTestId('auth-username');
        const emailInput_Reg = page.getByTestId('auth-email');
        const passwordInput_Reg = page.getByTestId('auth-password');
        const passwordConfirmInput_Reg = page.getByTestId('register-confirm-password');
        const agreeToTermsChbox_Reg = page.getByTestId('register-terms');
        const createAccountBtn_Reg = page.getByTestId('auth-submit');
        const userExistsErrorMsg_Reg = page.locator(`//*[@data-testid="error-messages"]/p[text()='body email або username вже зайняті']`)
        //const userNameTooShortErrorMsg = page.getByTestId('error-messages')

        /*Q: id of error element is the same, only text msg is different. 
        Should locators for error contain also text */

        await usernameInput_Reg.fill(username);
        await emailInput_Reg.fill(email);
        await passwordInput_Reg.fill(password);
        await passwordConfirmInput_Reg.fill(password);
        await agreeToTermsChbox_Reg.check();
        await createAccountBtn_Reg.click();
        await expect(userExistsErrorMsg_Reg).toBeVisible();
        //await expect(page.getByTestId('error-messages').getByRole('paragraph')).toContainText('body email або username вже зайняті');
    })

    test('REG3: Username less than 3 chars Validation Test', async ({ page }) => {
        let username = `Ol`;
        let email = `olena@example.com`;
        let password = `qwerty123`;

        const usernameInput_Reg = page.getByTestId('auth-username');
        const emailInput_Reg = page.getByTestId('auth-email');
        const passwordInput_Reg = page.getByTestId('auth-password');
        const passwordConfirmInput_Reg = page.getByTestId('register-confirm-password');
        const agreeToTermsChbox_Reg = page.getByTestId('register-terms');
        const createAccountBtn_Reg = page.getByTestId('auth-submit');
        const errorMsg_Reg = page.getByTestId('error-messages')

        await usernameInput_Reg.fill(username);
        await emailInput_Reg.fill(email);
        await passwordInput_Reg.fill(password);
        await passwordConfirmInput_Reg.fill(password);
        await agreeToTermsChbox_Reg.check();
        await createAccountBtn_Reg.click();
        await expect(errorMsg_Reg.getByText('username')).toBeVisible();
        await expect(errorMsg_Reg.getByRole('paragraph')).toContainText('username ім\'я має містити щонайменше 3 символи');
    });
});

test.describe('Login', { tag: '@hw9:variables' }, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/articles/login');
    });

    test('LOG1: User Logged in Success Test', async ({ page }) => {
        const email = `olena@example.com`;
        const password = `password`;

        const emailInput_Login = page.getByTestId('auth-email');
        const passwordInput_Login = page.getByTestId('auth-password');
        const signInBtn_Login = page.getByTestId('auth-submit');
        const userProfile_Header = page.getByTestId('nav-profile');
        const feedTab_Articles = page.getByTestId('feed-tab-your');

        await emailInput_Login.fill(email);
        await passwordInput_Login.fill(password);
        await signInBtn_Login.click();
        await expect(userProfile_Header).toBeVisible();
        await expect(userProfile_Header).toContainText('olena');
        await expect(feedTab_Articles).toBeVisible();
    });

    test('LOG2: Invalid Password Submitted Validation Test', async ({ page }) => {
        const email = `olena@example.com`;
        const password = `password_invalid`;

        const emailInput_Login = page.getByTestId('auth-email');
        const passwordInput_Login = page.getByTestId('auth-password');
        const signInBtn_Login = page.getByTestId('auth-submit');
        const errorMsg_Login = page.getByTestId('error-messages')

        await emailInput_Login.fill(email);
        await passwordInput_Login.fill(password);
        await signInBtn_Login.click();
        await expect(errorMsg_Login).toBeVisible();
        await expect(errorMsg_Login.getByRole('paragraph')).toContainText('email or password неправильні');
    });

    test('LOG3: Non-existing User Validation Test', async ({ page }) => {
        const email = `olena2@example.com`;
        const password = `password`;

        const emailInput_Login = page.getByTestId('auth-email');
        const passwordInput_Login = page.getByTestId('auth-password');
        const signInBtn_Login = page.getByTestId('auth-submit');
        const errorMsg_Login = page.getByTestId('error-messages')

        await emailInput_Login.fill(email);
        await passwordInput_Login.fill(password);
        await signInBtn_Login.click();
        await expect(errorMsg_Login).toBeVisible();
        await expect(errorMsg_Login.getByRole('paragraph')).toContainText('email or password неправильні');
    })
})