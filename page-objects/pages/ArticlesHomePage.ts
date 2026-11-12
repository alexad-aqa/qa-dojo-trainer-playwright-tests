import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlesHomePage extends BasePage {
  private readonly globalFeedTab;
  protected pagePath = '';
  private readonly previewArticleTitle;
  readonly articleLIst;

  constructor(page: Page) {
    super(page);
    this.globalFeedTab = page.getByTestId('feed-tab-global');
    this.previewArticleTitle = page.getByTestId(/preview-title/);
    this.articleLIst = page.getByTestId('article-list');
  }

  async goToGlobalFeed() {
    await this.globalFeedTab.click();
  }

  async readFirstArticle() {
    await this.previewArticleTitle.first().click();
  }
}
