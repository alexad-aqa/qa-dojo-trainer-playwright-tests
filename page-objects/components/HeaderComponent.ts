import { expect, Page } from '@playwright/test';

export class HeaderComponent {
  protected readonly page;
  protected readonly profileLocator;
  protected readonly newArticleTxtLink_Header;
  protected readonly homeTxtLink_Header;

  constructor(page: Page) {
    this.page = page;
    this.profileLocator = page.getByTestId('nav-profile');
    this.newArticleTxtLink_Header = page.getByTestId('nav-new-article');
    this.homeTxtLink_Header = page.getByTestId('nav-home');
  }

  async goToArticlesHomePage() {
    await this.homeTxtLink_Header.click();
  }

  async goToEditorPage() {
    await this.newArticleTxtLink_Header.click();
  }

  async clickProfileIcon() {
    await this.profileLocator.click();
  }

  async verifyProfileUsername(username) {
    await expect(this.profileLocator).toBeVisible();
    await expect(this.profileLocator).toContainText(username);
  }
}
