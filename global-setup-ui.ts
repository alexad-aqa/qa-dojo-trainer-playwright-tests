import { mkdir } from 'node:fs/promises';
import { chromium, expect, type FullConfig } from '@playwright/test';
import path from 'path';

export default async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const storageState = path.resolve(__dirname, 'playwright/.auth/user.json');
  const email = process.env.TEST_USER!;
  const password = process.env.TEST_PASSWORD!;

  if (!baseURL) {
    throw new Error('Потрібен baseURL у конфігурації');
  }

  if (!email || !password) {
    throw new Error('Задай TEST_USER і TEST_PASSWORD');
  }

  const authDir = path.resolve(__dirname, 'playwright/.auth');
  await mkdir(authDir, { recursive: true });
  //await mkdir('playwright/.auth', { recursive: true });
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    await page.goto('http://104.168.59.50/articles/login');
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill(password);
    await page.getByTestId('auth-submit').click();
    console.log('login via global.set');

    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('qa-dojo.token')))
      .toBeTruthy();

    await context.storageState({ path: storageState });
  } finally {
    await browser.close();
  }
}
