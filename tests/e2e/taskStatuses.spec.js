import { expect, test } from '@playwright/test';
import startApp from '../utils';

const statusData = {
  name: 'In progress',
  slug: 'in_progress',
};

let logInPage;
let taskManager;
let statusesTab;

test.beforeEach(async ({ page }) => {
  logInPage = await startApp(page);
  taskManager = await logInPage.logIn();
  statusesTab = await taskManager.goToTaskStatusesTab();
});

test('should content at least 1 task status', async () => {
  await expect(statusesTab.statusesTable.tableComponent).toBeTruthy();
  await expect.poll(async () => statusesTab.statusesTable.getItemsNumber()).toBeGreaterThan(0);
});

test('all statuses on the page should have "Name" and "Slug"', async () => {
  const statusesData = await statusesTab.statusesTable.getTableData();

  statusesData.forEach((status) => {
    expect(status.Name).toBeTruthy();
    expect(status.Slug).toBeTruthy();
  });
});

test('should be possible to delete statuses from the table', async () => {
  const statusesBefore = await statusesTab.statusesTable.getItemsNumber();
  const statusesToDeleteCount = 2;

  const selectedStatusesIds = await statusesTab.statusesTable.selectItemsOnPage(statusesToDeleteCount);
  const selectedStatusesCount = await statusesTab.statusesTable.getSelectedItemsNumber();
  await expect(selectedStatusesCount).toBe(statusesToDeleteCount);
  await statusesTab.statusesTable.deletSelectedItems();
  const statusesAfter = await statusesTab.statusesTable.getItemsNumber();

  for (const id of selectedStatusesIds) {
    await expect(await statusesTab.statusesTable.findItemById(id)).toBe('not found');
  }
  await expect(statusesAfter).toBe(statusesBefore - statusesToDeleteCount);
});

test('should be possible to delete all statuses from the table', async () => {
  const statusesCount = await statusesTab.statusesTable.getItemsNumber();

  await statusesTab.statusesTable.selectAllItems();
  const selectedStatusesCount = await statusesTab.statusesTable.getSelectedItemsNumber();
  await expect(selectedStatusesCount).toBe(statusesCount);
  await statusesTab.statusesTable.deletSelectedItems();

  await expect(statusesTab.statusesTable.tableComponent).not.toBeVisible();
});

test('should create new statuses', async () => {
  const statusesBefore = await statusesTab.statusesTable.getItemsNumber();
  const newStatusForm = await statusesTab.statusesTable.createNewItem(statusesTab.editableFields);

  await newStatusForm.fillInputByLabel('Name', statusData.name);
  await newStatusForm.fillInputByLabel('Slug', statusData.slug);
  const newStatusId = await newStatusForm.saveItem();
  await taskManager.goToTaskStatusesTab();
  const statusesAfter = await statusesTab.statusesTable.getItemsNumber();
  const newstatusData = await statusesTab.statusesTable.getItemDataById(newStatusId);

  expect(newstatusData).toMatchObject({ Name: statusData.name });
  expect(newstatusData).toMatchObject({ Slug: statusData.slug });
  await expect(statusesAfter).toBe(statusesBefore + 1);
});

test('should not create status whithout data', async () => {
  const newStatusForm = await statusesTab.statusesTable.createNewItem(statusesTab.editableFields);

  await expect(newStatusForm.saveButton).toBeDisabled();
});

test('should edit status data', async () => {
  const statusEditForm = await statusesTab.statusesTable.editItemById('1', statusesTab.editableFields);

  await statusEditForm.fillInputByLabel('Name', statusData.name);
  await statusEditForm.saveItem();
  const editedStatus = await statusesTab.statusesTable.getItemDataById('1');

  await expect(editedStatus.Name).toEqual(statusData.name);
});
