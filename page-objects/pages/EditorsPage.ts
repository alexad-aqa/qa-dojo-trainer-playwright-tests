import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditorsPage extends BasePage {
  protected pagePath = '';
  private readonly title;
  private readonly description;
  private readonly body;
  private readonly tag;
  private readonly submitArticleBtn;
  private readonly editBtn;

  constructor(page: Page) {
    super(page);

    this.title = page.getByTestId('editor-title');
    this.description = page.getByTestId('editor-description');
    this.body = page.getByTestId('editor-body');
    this.tag = page.getByTestId('editor-tags');
    this.submitArticleBtn = page.getByTestId('editor-submit');
    this.editBtn = page.getByTestId('edit-article-button');
  }

  async openEditorsPage() {
    await this.page.goto('/articles/editor');
  }

  async fillArticleTitle(title) {
    await this.title.fill(title);
  }

  async fillArticleDescription(description) {
    await this.description.fill(description);
  }

  async fillArticleBody(body) {
    await this.body.fill(body);
  }

  async fillArticleTag(tag) {
    await this.tag.fill(tag);
  }

  async submitArticleData() {
    await this.submitArticleBtn.click();
  }

  async createArticle(title, description, body, tag) {
    await this.fillArticleTitle(title);
    await this.fillArticleDescription(description);
    await this.fillArticleBody(body);
    await this.fillArticleTag(tag.toString());
    await this.submitArticleData();
    await this.waitForArticleEditBtnVisible();
  }

  async waitForArticleEditBtnVisible() {
    await this.editBtn.waitFor({ state: 'visible', timeout: 5000 });
  }

  async createMultipleArticles(articleQty) {
    const myTitles = [];
    const randomNumber = Math.floor(Math.random() * 1000000);
    for (let i = 1; i <= articleQty; i++) {
      const title = `aqa1_${randomNumber}-${i}`;
      const description = `aqa1-${i}`;
      const body = `aqa1-${i}`;
      const tag = ['automation, functions, arrays'];

      await this.openEditorsPage();
      await this.createArticle(title, description, body, tag.toString());
      myTitles.push(title);
      //await waitForArticleEditBtnVisible(page);
    }
    return myTitles;
  }
}
