import { expect, Page } from '@playwright/test';

export class HeaderComponent {
  protected readonly page;
  protected readonly profileLocator;

  constructor(page: Page) {
    this.page = page;
    this.profileLocator = page.getByTestId('nav-profile');
  }

  async clickProfileIcon() {
    await this.profileLocator.click();
  }

  async verifyProfileUsername(username) {
    await expect(this.profileLocator).toBeVisible();
    await expect(this.profileLocator).toContainText(username);
  }
}
