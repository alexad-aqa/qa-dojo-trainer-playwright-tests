import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  private readonly chooseFileLocator;
  private readonly submitSettingsLocator;
  private readonly avatarAddressInput;
  private readonly settingsAvatarPreview;
  private readonly settingsAvatarFile;
  private readonly usernameInput;
  private readonly emailInput;

  constructor(page: Page) {
    super(page);

    this.chooseFileLocator = page.getByTestId('settings-avatar-file');
    this.submitSettingsLocator = page.getByTestId('settings-submit');
    this.settingsAvatarPreview = page
      .getByTestId('settings-avatar-preview')
      .locator('img');
    this.avatarAddressInput = page.getByTestId('settings-image');
    this.settingsAvatarFile = page.getByTestId('settings-avatar-file');
    this.usernameInput = page.getByTestId('settings-username');
    this.emailInput = page.getByTestId('settings-email');
  }

  async uploadFile(file) {
    await this.chooseFileLocator.setInputFiles(file);
    await expect(this.settingsAvatarFile).toBeVisible();
  }

  async submitSettings() {
    await this.submitSettingsLocator.click();
  }

  async getAvatarAddressPrefix() {
    const fullValue = await this.avatarAddressInput.inputValue();
    const prefixOnly = fullValue.split(',')[0];
    console.log('this is file address prefix on Settings ' + prefixOnly);
    return prefixOnly;
  }

  async verifyAvatarUploaded(expectedSrc) {
    await expect(this.settingsAvatarPreview).toBeVisible();
    await expect(this.settingsAvatarPreview).toHaveAttribute(
      'src',
      new RegExp(`^${expectedSrc}`),
    );
  }

  async verifyUsername(username) {
    await expect(this.usernameInput).toHaveValue(username);
  }

  async verifyEmail(email) {
    await expect(this.emailInput).toHaveValue(email);
  }
}
