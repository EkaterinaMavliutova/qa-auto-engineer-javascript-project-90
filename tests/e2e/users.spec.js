import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

const userData = {
  firstName: "Sally",
  lastName: "Hanson",
  email: "sally@test.com",
  password: "secret",
};

test.beforeEach(async ({ taskManager: { logInPage, sideBar } }) => {
  await logInPage.logIn();
  await sideBar.goToUsersTab();
});

test("should content at least 1 user", async ({ taskManager: { usersTab } }) => {
  await expect(usersTab.usersTable.table).toBeTruthy();
  await expect
    .poll(async () => usersTab.usersTable.getItemsNumber())
    .toBeGreaterThan(0);
});

test('all users on the page should have "First name", "Last name" and "Email"', async ({ taskManager: { usersTab } }) => {
  const usersData = await usersTab.usersTable.getTableData();

  usersData.forEach((user) => {
    expect(user["First name"]).toBeTruthy();
    expect(user["Last name"]).toBeTruthy();
    expect(user["Email"]).toBeTruthy();
  });
});

test("should be possible to delete users from the table", async ({ taskManager: { usersTab } }) => {
  const usersBefore = await usersTab.usersTable.getItemsNumber();
  const usersToDeleteCount = 2;

  const selectedUsersIds = await usersTab.usersTable.selectItemsOnPage(usersToDeleteCount);
  const selectedUsersCount = await usersTab.usersTable.getSelectedItemsNumber();
  await expect(selectedUsersCount).toBe(usersToDeleteCount);
  await usersTab.usersTable.deletSelectedItems();
  const usersAfter = await usersTab.usersTable.getItemsNumber();

  for (const id of selectedUsersIds) {
    await expect(await usersTab.usersTable.findItemById(id)).toBe("not found");
  }
  await expect(usersAfter).toBe(usersBefore - usersToDeleteCount);
});

test("should be possible to delete all users from the table", async ({ taskManager: { usersTab } }) => {
  const usersCount = await usersTab.usersTable.getItemsNumber();

  await usersTab.usersTable.selectAllItems();
  const selectedUsersCount = await usersTab.usersTable.getSelectedItemsNumber();
  await expect(selectedUsersCount).toBe(usersCount);
  await usersTab.usersTable.deletSelectedItems();

  await expect(usersTab.usersTable.table).not.toBeVisible();
});

test("should create new users", async ({ taskManager: { sideBar, usersTab } }) => {
  const usersBefore = await usersTab.usersTable.getItemsNumber();
  await usersTab.usersTable.createNewItem();

  await usersTab.form.fillInputByLabel('Email', userData.email);
  await usersTab.form.fillInputByLabel('First name', userData.firstName);
  await usersTab.form.fillInputByLabel('Last name', userData.lastName);
  await usersTab.form.fillInputByLabel('Password', userData.password);
  const newUserId = await usersTab.form.saveItem();
  await sideBar.goToUsersTab();
  const usersAfter = await usersTab.usersTable.getItemsNumber();
  const newUserData = await usersTab.usersTable.getItemDataById(newUserId);

  expect(newUserData).toMatchObject({ Email: userData.email });
  expect(newUserData).toMatchObject({ 'First name': userData.firstName });
  expect(newUserData).toMatchObject({ 'Last name': userData.lastName });
  await expect(usersAfter).toBe(usersBefore + 1);
});

test("should not create user whithout data", async ({ taskManager: { usersTab } }) => {
  await usersTab.usersTable.createNewItem();

  await expect(usersTab.form.saveButton).toBeDisabled();
});

test("should edit user data", async ({ taskManager: { usersTab } }) => {
  await usersTab.usersTable.editItemById("1");

  await usersTab.form.fillInputByLabel("Last name", userData.lastName);
  await usersTab.form.saveItem();
  const editedUser = await usersTab.usersTable.getItemDataById("1");

  await expect(editedUser["Last name"]).toEqual(userData.lastName);
});
