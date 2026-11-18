import { mkdir, writeFile } from 'node:fs/promises';
import { request, type FullConfig } from '@playwright/test';
import path from 'path';
import { UserController } from './controllers/UserController';
import { createLocalStorage } from './fixtures/my-fixture';

export default async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const email = process.env.TEST_USER;
  const password = process.env.TEST_PASSWORD;

  if (!baseURL || typeof storageState !== 'string') {
    throw new Error('Потрібні baseURL і шлях до storageState у конфігурації');
  }

  if (!email || !password) {
    throw new Error('Задай TEST_USER і TEST_PASSWORD');
  }

  // 1. Get token via API (no browser needed)
  const apiContext = await request.newContext({ baseURL });
  let token: string;
  try {
    const userController = new UserController(apiContext);
    token = await userController.loginUserApi({ email, password });
  } finally {
    await apiContext.dispose();
  }

  if (!token) {
    throw new Error('Login API did not return a token');
  }
  console.log('login via global-setup-api (API)');

  // 2. Build storageState with token in localStorage and save it
  const state = createLocalStorage(baseURL, token);

  await mkdir(path.dirname(storageState), { recursive: true });
  await writeFile(storageState, JSON.stringify(state, null, 2));
}
