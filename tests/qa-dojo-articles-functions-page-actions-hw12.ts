import { Page } from '@playwright/test';

function getRegPageLocators(page: Page) {

    const usernameInput_Reg = page.getByTestId('auth-username');
    const emailInput_Reg = page.getByTestId('auth-email');
    const passwordInput_Reg = page.getByTestId('auth-password');
    const passwordConfirmInput_Reg = page.getByTestId('register-confirm-password');
    const agreeToTermsChbox_Reg = page.getByTestId('register-terms');
    const createAccountBtn_Reg = page.getByTestId('auth-submit');

    return {
        usernameInput_Reg,
        emailInput_Reg,
        passwordInput_Reg,
        passwordConfirmInput_Reg,
        agreeToTermsChbox_Reg,
        createAccountBtn_Reg,
    };
};

export async function fillUsernameReg(page: Page, username: string) {
    const regPageLocators = getRegPageLocators(page);
    await regPageLocators.usernameInput_Reg.fill(username);
};

export async function fillEmailReg(page: Page, email) {
    const regPageLocators = getRegPageLocators(page);
    await regPageLocators.emailInput_Reg.fill(email);
};

export async function fillPasswordReg(page: Page, password) {
    const regPageLocators = getRegPageLocators(page);
    await regPageLocators.passwordInput_Reg.fill(password);
};

export async function fillConfirmPasswordReg(page: Page, password) {
    const regPageLocators = getRegPageLocators(page);
    await regPageLocators.passwordConfirmInput_Reg.fill(password);
};

export async function agreeToTermsReg(page: Page) {
    const regPageLocators = getRegPageLocators(page);
    await regPageLocators.agreeToTermsChbox_Reg.check();
};

export async function submitReg(page: Page) {
    const regPageLocators = getRegPageLocators(page);
    await regPageLocators.createAccountBtn_Reg.click();
};

export async function submitRegistrationForm(page: Page, username, email, password) {
    const regPageLocators = getRegPageLocators(page);
    await regPageLocators.usernameInput_Reg.fill(username);
    await regPageLocators.emailInput_Reg.fill(email);
    await regPageLocators.passwordInput_Reg.fill(password);
    await regPageLocators.passwordConfirmInput_Reg.fill(password);
    await regPageLocators.agreeToTermsChbox_Reg.check();
    await regPageLocators.createAccountBtn_Reg.click();
};

function getLoginPageLocators(page: Page) {

    const emailInput_Login = page.getByTestId('auth-email');
    const passwordInput_Login = page.getByTestId('auth-password');
    const signInBtn_Login = page.getByTestId('auth-submit');

    return {
        emailInput_Login,
        passwordInput_Login,
        signInBtn_Login
    };
};

export async function fillEmailLogin(page: Page, email) {
    const loginPageLocators = getLoginPageLocators(page);
    await loginPageLocators.emailInput_Login.fill(email);
};

export async function fillPasswordLogin(page: Page, password) {
    const loginPageLocators = getLoginPageLocators(page);
    await loginPageLocators.passwordInput_Login.fill(password);
};

export async function submitLogin(page: Page) {
    const loginPageLocators = getLoginPageLocators(page);
    await loginPageLocators.signInBtn_Login.click();
};

export async function submitLoginForm(page: Page, email, password) {
    const loginPageLocators = getLoginPageLocators(page);
    await loginPageLocators.emailInput_Login.fill(email);
    await loginPageLocators.passwordInput_Login.fill(password);
    await loginPageLocators.signInBtn_Login.click();
};

