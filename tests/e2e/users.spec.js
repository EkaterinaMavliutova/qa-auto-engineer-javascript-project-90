import { expect, test } from '@playwright/test';
import startApp from './utils/utils';

const userData = {
  firstName: 'Sally',
  lastName: 'Hanson',
  email: 'sally@test.com',
  password: 'secret',
};

let logInPage;
let taskManager;
let usersTab;

test.beforeEach(async ({ page }) => {
  logInPage = await startApp(page);
  taskManager = await logInPage.logIn();
  usersTab = await taskManager.goToUsersTab();
});

test('should content at least 1 user', async () => {
  await expect(usersTab.usersTable.tableComponent).toBeTruthy();
  await expect.poll(async () => usersTab.usersTable.getItemsNumber()).toBeGreaterThan(0);
});

test('all users on the page should have "First name", "Last name" and "Email"', async () => {
  const usersData = await usersTab.usersTable.getTableData();

  usersData.forEach((user) => {
    expect(user['First name']).toBeTruthy();
    expect(user['Last name']).toBeTruthy();
    expect(user['Email']).toBeTruthy();
  });
});

test('should be possible to delete users from the table', async () => {
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
});

test('should be possible to delete all users from the table', async () => {
  const usersCount = await usersTab.usersTable.getItemsNumber();

  await usersTab.usersTable.selectAllItems();
  const selectedUsersCount = await usersTab.usersTable.getSelectedItemsNumber();
  await expect(selectedUsersCount).toBe(usersCount);
  await usersTab.usersTable.deletSelectedItems();

  await expect(usersTab.usersTable.tableComponent).not.toBeVisible();
});

test('should create new users', async () => {
  const usersBefore = await usersTab.usersTable.getItemsNumber();
  const newUserForm = await usersTab.usersTable.createNewItem(usersTab.editableFields);

  await newUserForm.fillInputByLabel('Email', userData.email);
  await newUserForm.fillInputByLabel('First name', userData.firstName);
  await newUserForm.fillInputByLabel('Last name', userData.lastName);
  await newUserForm.fillInputByLabel('Password', userData.password);
  const newUserId = await newUserForm.saveItem();
  await taskManager.goToUsersTab();
  const usersAfter = await usersTab.usersTable.getItemsNumber();
  const newUserData = await usersTab.usersTable.getItemDataById(newUserId);

  expect(newUserData).toMatchObject({ Email: userData.email });
  expect(newUserData).toMatchObject({ 'First name': userData.firstName });
  expect(newUserData).toMatchObject({ 'Last name': userData.lastName });
  await expect(usersAfter).toBe(usersBefore + 1);
});

test('should not create user whithout data', async () => {
  const newUserForm = await usersTab.usersTable.createNewItem(usersTab.editableFields);

  await expect(newUserForm.saveButton).toBeDisabled();
});

test('should edit user data', async () => {
  const userEditForm = await usersTab.usersTable.editItemById('1', usersTab.editableFields);

  await userEditForm.fillInputByLabel('Last name', userData.lastName);
  await userEditForm.saveItem();
  const editedUser = await usersTab.usersTable.getItemDataById('1');

  await expect(editedUser['Last name']).toEqual(userData.lastName);
});
