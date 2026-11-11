import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  private readonly profileUsernameLocator;
  protected pagePath = '';
  private readonly editProfileLocator;
  private readonly profileAvatar;

  constructor(page: Page) {
    super(page);

    this.profileUsernameLocator = page.getByTestId('profile-username');
    this.editProfileLocator = page.getByRole('link', { name: 'Edit profile' });
    this.profileAvatar = page.getByTestId('profile-page').locator('img');
  }

  async openProfileSettingPage() {
    await this.editProfileLocator.click();
    await this.page.waitForURL('/articles/settings');
  }

  async verifyAvatar(expectedSrc) {
    await expect(this.profileAvatar).toBeVisible();
    await expect(this.profileAvatar).toHaveAttribute(
      'src',
      new RegExp(`^${expectedSrc}`),
    );
  }

  async verifyUsername(username) {
    await expect(this.profileUsernameLocator).toBeVisible();
    await expect(this.profileUsernameLocator).toContainText(username);
  }
}
