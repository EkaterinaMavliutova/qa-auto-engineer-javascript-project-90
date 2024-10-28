import { expect, test } from '@playwright/test';
import startApp from './utils/utils';

let logInPage;

test.beforeEach(async ({ page }) => {
  logInPage = await startApp(page);
});

test('should render logIn form', async () => {
  await expect(logInPage.userNameInput).toBeVisible();
  await expect(logInPage.passwordInput).toBeVisible();
  await expect(logInPage.signInButton).toBeVisible();
});

test('should log in when username and password provided', async () => {
  const taskManager = await logInPage.logIn();

  await expect(taskManager.fillerMessage).toBeVisible();
  await expect(taskManager.header.profileImage).toBeVisible();
  await expect(taskManager.header.profileButton).toHaveText('Jane Doe');
});

test('should not log in when only username is provided', async () => {
  const taskManager = await logInPage.tryToLogIn('username');

  await expect(logInPage.errorMessage).toBeVisible();
  await expect(taskManager.fillerMessage).not.toBeVisible();
});

test('should not log in when only password is provided', async () => {
  const taskManager = await logInPage.tryToLogIn('password');

  await expect(logInPage.errorMessage).toBeVisible();
  await expect(taskManager.fillerMessage).not.toBeVisible();
});

test('should not log in when no username and password provided', async () => {
  const taskManager = await logInPage.tryToLogIn();

  await expect(logInPage.errorMessage).toBeVisible();
  await expect(taskManager.fillerMessage).not.toBeVisible();
});

test('should be possible to log out', async () => {
  const taskManager = await logInPage.logIn();

  await taskManager.logOut();

  await expect(logInPage.userNameInput).toBeVisible();
});
