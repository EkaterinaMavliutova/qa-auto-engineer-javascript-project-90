import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

const statusData = {
  name: "In progress",
  slug: "in_progress",
};

test.beforeEach(async ({ taskManager: { logInPage, sideBar } }) => {
  await logInPage.logIn();
  await sideBar.goToTaskStatusesTab();
});

test("should content at least 1 task status", async ({ taskManager: { taskStatusesTab } }) => {
  await expect(taskStatusesTab.statusesTable.table).toBeTruthy();
  await expect
    .poll(async () => taskStatusesTab.statusesTable.getItemsNumber())
    .toBeGreaterThan(0);
});

test('all statuses on the page should have "Name" and "Slug"', async ({ taskManager: { taskStatusesTab } }) => {
  const statusesData = await taskStatusesTab.statusesTable.getTableData();

  statusesData.forEach((status) => {
    expect(status.Name).toBeTruthy();
    expect(status.Slug).toBeTruthy();
  });
});

test("should be possible to delete statuses from the table", async ({ taskManager: { taskStatusesTab } }) => {
  const statusesBefore = await taskStatusesTab.statusesTable.getItemsNumber();
  const statusesToDeleteCount = 2;

  const selectedStatusesIds = await taskStatusesTab.statusesTable.selectItemsOnPage(statusesToDeleteCount);
  const selectedStatusesCount = await taskStatusesTab.statusesTable.getSelectedItemsNumber();
  await expect(selectedStatusesCount).toBe(statusesToDeleteCount);
  await taskStatusesTab.statusesTable.deletSelectedItems();
  const statusesAfter = await taskStatusesTab.statusesTable.getItemsNumber();

  for (const id of selectedStatusesIds) {
    await expect(await taskStatusesTab.statusesTable.findItemById(id)).toBe( "not found");
  }
  await expect(statusesAfter).toBe(statusesBefore - statusesToDeleteCount);
});

test("should be possible to delete all statuses from the table", async ({ taskManager: { taskStatusesTab } }) => {
  const statusesCount = await taskStatusesTab.statusesTable.getItemsNumber();

  await taskStatusesTab.statusesTable.selectAllItems();
  const selectedStatusesCount = await taskStatusesTab.statusesTable.getSelectedItemsNumber();
  await expect(selectedStatusesCount).toBe(statusesCount);
  await taskStatusesTab.statusesTable.deletSelectedItems();

  await expect(taskStatusesTab.statusesTable.table).not.toBeVisible();
});

test("should create new statuses", async ({ taskManager: { sideBar, taskStatusesTab } }) => {
  const statusesBefore = await taskStatusesTab.statusesTable.getItemsNumber();
  await taskStatusesTab.statusesTable.createNewItem();

  await taskStatusesTab.form.fillInputByLabel("Name", statusData.name);
  await taskStatusesTab.form.fillInputByLabel("Slug", statusData.slug);
  const newStatusId = await taskStatusesTab.form.saveItem();
  await sideBar.goToTaskStatusesTab();
  const statusesAfter = await taskStatusesTab.statusesTable.getItemsNumber();
  const newstatusData = await taskStatusesTab.statusesTable.getItemDataById(newStatusId);

  expect(newstatusData).toMatchObject({ Name: statusData.name });
  expect(newstatusData).toMatchObject({ Slug: statusData.slug });
  await expect(statusesAfter).toBe(statusesBefore + 1);
});

test("should not create status whithout data", async ({ taskManager: { taskStatusesTab } }) => {
  await taskStatusesTab.statusesTable.createNewItem();

  await expect(taskStatusesTab.form.saveButton).toBeDisabled();
});

test("should edit status data", async ({ taskManager: { taskStatusesTab } }) => {
  await taskStatusesTab.statusesTable.editItemById('1');

  await taskStatusesTab.form.fillInputByLabel("Name", statusData.name);
  await taskStatusesTab.form.saveItem();
  const editedStatus = await taskStatusesTab.statusesTable.getItemDataById("1");

  await expect(editedStatus.Name).toEqual(statusData.name);
});
