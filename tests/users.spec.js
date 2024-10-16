import { expect, test } from '@playwright/test';
import startApp from './utils';

test('should content at least 1 user', async ({ page }) => {
  const logInPage = await startApp(page);
  const taskManager = await logInPage.logIn();
  const usersTab = await taskManager.goToUsersTab();

  await expect(usersTab.usersTable.tableComponent).toBeTruthy();
  await expect.poll(async () => usersTab.usersTable.getItemsNumber()).toBeGreaterThan(0);
});

test('all users on the page should have "First name", "Last name" and "Email"', async ({ page }) => {
  const logInPage = await startApp(page);
  const taskManager = await logInPage.logIn();
  const usersTab = await taskManager.goToUsersTab();

  const usersData = await usersTab.usersTable.getTableData();

  usersData.forEach((user) => {
    expect(user['First name']).toBeTruthy();
    expect(user['Last name']).toBeTruthy();
    expect(user['Email']).toBeTruthy();
  });
  // await expect(tableHeaders[1]).toBe('Id');
});
