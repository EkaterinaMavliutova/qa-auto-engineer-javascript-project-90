import { expect, test } from '@playwright/test';
import startApp from './utils';

test('should render logIn form', async ({ page }) => {
  const logInPage = await startApp(page);

  await expect(logInPage.userNameInput).toBeVisible();
  await expect(logInPage.passwordInput).toBeVisible();
  await expect(logInPage.signInButton).toBeVisible();
});

test('should log in when username and password provided', async ({ page }) => {
  const logInPage = await startApp(page);
  const taskManager = await logInPage.logIn();

  await expect(taskManager.fillerMessage).toBeVisible();
  await expect(taskManager.header.profileImage).toBeVisible();
  await expect(taskManager.header.profileButton).toHaveText('Jane Doe');
});

test('should not log in when only username is provided', async ({ page }) => {
  const logInPage = await startApp(page);
  const taskManager = await logInPage.tryToLogIn('username');

  await expect(logInPage.errorMessage).toBeVisible();
  await expect(taskManager.fillerMessage).not.toBeVisible();
});

test('should not log in when only password is provided', async ({ page }) => {
  const logInPage = await startApp(page);
  const taskManager = await logInPage.tryToLogIn('password');

  await expect(logInPage.errorMessage).toBeVisible();
  await expect(taskManager.fillerMessage).not.toBeVisible();
});

test('should not log in when no username and password provided', async ({ page }) => {
  const logInPage = await startApp(page);
  const taskManager = await logInPage.tryToLogIn();

  await expect(logInPage.errorMessage).toBeVisible();
  await expect(taskManager.fillerMessage).not.toBeVisible();
});

test('should be possible to log out', async ({ page }) => {
  const logInPage = await startApp(page);
  const taskManager = await logInPage.logIn();

  await taskManager.logOut();

  await expect(logInPage.userNameInput).toBeVisible();
});
