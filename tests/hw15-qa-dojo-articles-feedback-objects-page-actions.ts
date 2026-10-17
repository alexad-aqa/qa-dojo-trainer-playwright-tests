import { expect } from '@playwright/test';

async function getLocators(page) {
    return {
        name: () => page.getByTestId('contact-name'),
        email: () => page.getByTestId('contact-email'),
        subject: () => page.getByTestId('contact-subject'),
        priority: (priority) => page.getByTestId(`contact-priority-${priority}`),
        priorityLow: () => page.getByTestId('contact-priority-low'),
        priorityMedium: () => page.getByTestId('contact-priority-medium'),
        priorityHigh: () => page.getByTestId('contact-priority-high'),
        message: () => page.getByTestId('contact-message'),
        chooseFile: () => page.getByTestId('contact-attachments'),
        sendCopy: () => page.getByTestId('contact-copy-me'),
        submit: () => page.getByTestId('contact-submit'),
        successCard: () => page.getByTestId('contact-success'),
        errorAlert: () => page.getByTestId('error-messages'),
        contactForm: () => page.getByTestId('contact-form'),
        successTextMsg: (email) => `Дякуємо! 🎉Ваше звернення надіслано. Ми відповімо на ${email}.Надіслати ще одне`,
        nameRequiredError: `name обов'язкове поле`,
        emailRequiredError: `mail некоректний email`,
        messageRequiredError: `message обов'язкове поле`
    };
};

export async function goToFeedbackPage(page) {
    await page.goto('/articles/contact');
};

export async function setName(page, name) {
    const locators = await getLocators(page);
    await locators.name().fill(name);
};

export async function setEmail(page, email) {
    const locators = await getLocators(page);
    await locators.email().fill(email);
};

export async function selectSubject(page, subject) {
    const locators = await getLocators(page);
    await locators.subject().selectOption(subject);
};

async function selectSubjectGeneral(page) {
    const locators = await getLocators(page);
    await locators.subject().selectOption('general');
};

async function selectSubjectBug(page) {
    const locators = await getLocators(page);
    await locators.subject().selectOption('bug');
};

async function selectSubjectFeature(page) {
    const locators = await getLocators(page);
    await locators.subject().selectOption('feature');
};

async function selectSubjectAccount(page) {
    const locators = await getLocators(page);
    await locators.subject().selectOption('account');
};

export async function selectPriority(page, priority) {
    const locators = await getLocators(page);
    await locators.priority(priority).click()
};

async function selectPriorityLow(page) {
    const locators = await getLocators(page);
    await locators.priorityLow().click()
};

async function selectPriorityMedium(page) {
    const locators = await getLocators(page);
    await locators.priorityMedium().click()
};

async function selectPriorityHigh(page) {
    const locators = await getLocators(page);
    await locators.priorityHigh().click();
};

export async function setMessage(page, message) {
    const locators = await getLocators(page);
    await locators.message().fill(message);
};

export async function uploadFile(page, file) {
    const locators = await getLocators(page);
    await locators.chooseFile().setInputFiles(file)
};

export async function sendCopy(page, sendCopy) {
    const locators = await getLocators(page);
    await locators.sendCopy().setChecked(sendCopy)
};

export async function submit(page) {
    const locators = await getLocators(page);
    await locators.submit().click();
};

export async function submitFeedbackForm(page, name, email, subject, priority, message, file, sendCopyState) {
    await setName(page, name);
    await setEmail(page, email);
    await selectSubject(page, subject);
    await selectPriority(page, priority);
    await setMessage(page, message);
    await uploadFile(page, file);
    await sendCopy(page, sendCopyState);
    await submit(page);
};

export async function waitFormVisible(page) {
    const locators = await getLocators(page);
    await locators.contactForm().waitFor({ state: 'visible', timeout: 3000 })
}

//**  ASSERTIONS for Feedback Page */

export async function expectSuccessMsg(page, email) {
    const locators = await getLocators(page);
    await expect(locators.successCard()).toBeVisible();
    await expect(locators.successCard()).toHaveText(locators.successTextMsg(email));
};

export async function expectErrorAlert(page) {
    const locators = await getLocators(page);
    await expect(locators.errorAlert()).toBeVisible();
};

export async function expectErrorNameRequired(page) {
    const locators = await getLocators(page);
    await expect(locators.errorAlert()).toContainText(locators.nameRequiredError);
};

export async function expectErrorEmailRequired(page) {
    const locators = await getLocators(page);
    await expect(locators.errorAlert()).toContainText(locators.emailRequiredError);
};
export async function expectErrorMessageRequired(page) {
    const locators = await getLocators(page);
    await expect(locators.errorAlert()).toContainText(locators.messageRequiredError);
};