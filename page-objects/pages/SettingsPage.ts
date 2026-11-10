import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  private readonly chooseFileLocator;
  private readonly submitSettingsLocator;
  private readonly avatarAddressInput;
  private readonly settingsAvatarPreview;
  private readonly settingsAvatarFile;

  constructor(page: Page) {
    super(page);

    this.chooseFileLocator = page.getByTestId('settings-avatar-file');
    this.submitSettingsLocator = page.getByTestId('settings-submit');
    this.settingsAvatarPreview = page.getByTestId('settings-avatar-preview');
    this.avatarAddressInput = page.getByTestId('settings-image');
    this.settingsAvatarFile = page.getByTestId('settings-avatar-file');
  }

  async uploadFile(file) {
    await this.chooseFileLocator.setInputFiles(file);
    await expect(this.settingsAvatarFile).toBeVisible();
    await expect(this.settingsAvatarPreview).toBeVisible();
    //await avatar.waitFor({ state: 'visible', timeout: 10000 });
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
}
