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

test('should be possible to delete users from the table', async ({ page }) => {
  const logInPage = await startApp(page);
  const taskManager = await logInPage.logIn();
  const usersTab = await taskManager.goToUsersTab();
  const usersBefore = await usersTab.usersTable.getItemsNumber();
  const usersToDeleteCount = 2;

  const selectedUsersIds = await usersTab.usersTable.selectItemsOnPage(usersToDeleteCount);
  const selectedUsersCount = await usersTab.usersTable.getSelectedItemsNumber();
  await expect(selectedUsersCount).toBe(usersToDeleteCount);
  await usersTab.usersTable.deletSelectedItems();
  const usersAfter = await usersTab.usersTable.getItemsNumber();

  for (const id of selectedUsersIds) {
    await expect(await usersTab.usersTable.findItemById(id)).toBe('not found');
  }
  await expect(usersAfter).toBe(usersBefore - usersToDeleteCount);

  // const userById = await usersTab.usersTable.findItemById('3');
  // console.log('userById: ', userById);
  //   await userById.click();
  // console.log(`!!!!!!!SelectedUsersCount: ${selectedUsersCount}`);
});
