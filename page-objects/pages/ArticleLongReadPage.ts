import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticleLongReadPage extends BasePage {
  protected pagePath = '';
  readonly articleTitle;
  readonly articleDescription;
  readonly articleBody;
  readonly articleTags;

  constructor(page: Page) {
    super(page);
    this.articleTitle = page.getByTestId('article-title');
    this.articleBody = page.getByTestId('article-body');
    this.articleTags = page.getByTestId('article-tags');
    this.articleDescription = page.locator('article > p').nth(1);
  }

  async goToGlobalFeed() {
    await this.articleTitle;
  }
}
