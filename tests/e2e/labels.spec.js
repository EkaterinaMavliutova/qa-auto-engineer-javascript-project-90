import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

const labelData = {
  name: 'New',
};

test.beforeEach(async ({ taskManager: { logInPage, sideBar } }) => {
  await logInPage.logIn();
  await sideBar.goToLabelsTab();
});

test('should content at least 1 task status', async ({ taskManager: { labelsTab } }) => {
  await expect(labelsTab.labelsTable.table).toBeTruthy();
  await expect.poll(async () => labelsTab.labelsTable.getItemsNumber()).toBeGreaterThan(0);
});

test('all labels on the page should have "Name"', async ({ taskManager: { labelsTab } }) => {
  const labelsData = await labelsTab.labelsTable.getTableData();

  labelsData.forEach((label) => {
    expect(label.Name).toBeTruthy();
  });
});

test('should be possible to delete labels from the table', async ({ taskManager: { labelsTab } }) => {
  const labelsBefore = await labelsTab.labelsTable.getItemsNumber();
  const labelsToDeleteCount = 2;

  const selectedLabelsIds = await labelsTab.labelsTable.selectItemsOnPage(labelsToDeleteCount);
  const selectedLabelsCount = await labelsTab.labelsTable.getSelectedItemsNumber();
  await expect(selectedLabelsCount).toBe(labelsToDeleteCount);
  await labelsTab.labelsTable.deletSelectedItems();
  const labelsAfter = await labelsTab.labelsTable.getItemsNumber();

  for (const id of selectedLabelsIds) {
    await expect(await labelsTab.labelsTable.findItemById(id)).toBe('not found');
  }
  await expect(labelsAfter).toBe(labelsBefore - labelsToDeleteCount);
});

test('should be possible to delete all labels from the table', async ({ taskManager: { labelsTab } }) => {
  const labelsCount = await labelsTab.labelsTable.getItemsNumber();

  await labelsTab.labelsTable.selectAllItems();
  const selectedLabelsCount = await labelsTab.labelsTable.getSelectedItemsNumber();
  await expect(selectedLabelsCount).toBe(labelsCount);
  await labelsTab.labelsTable.deletSelectedItems();

  await expect(labelsTab.labelsTable.table).not.toBeVisible();
});

test('should create new labels', async ({ taskManager: { sideBar, labelsTab } }) => {
  const labelsBefore = await labelsTab.labelsTable.getItemsNumber();
  await labelsTab.labelsTable.createNewItem();

  await labelsTab.form.fillInputByLabel('Name', labelData.name);
  const newLabelId = await labelsTab.form.saveItem();
  await sideBar.goToLabelsTab();
  const labelsAfter = await labelsTab.labelsTable.getItemsNumber();
  const newLabelData = await labelsTab.labelsTable.getItemDataById(newLabelId);

  expect(newLabelData).toMatchObject({ Name: labelData.name });
  await expect(labelsAfter).toBe(labelsBefore + 1);
});

test('should not create label whithout data', async ({ taskManager: { labelsTab } }) => {
  await labelsTab.labelsTable.createNewItem();

  await expect(labelsTab.form.saveButton).toBeDisabled();
});

test('should edit label data', async ({ taskManager: { labelsTab } }) => {
  await labelsTab.labelsTable.editItemById('1');

  await labelsTab.form.fillInputByLabel('Name', labelData.name);
  await labelsTab.form.saveItem();
  const editedLabel = await labelsTab.labelsTable.getItemDataById('1');

  await expect(editedLabel.Name).toEqual(labelData.name);
});
