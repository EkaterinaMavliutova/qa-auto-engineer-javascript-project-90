import { expect, test } from '@playwright/test';
import startApp from '../utils';

const labelData = {
  name: 'New',
};

let logInPage;
let taskManager;
let labelsTab;

test.beforeEach(async ({ page }) => {
  logInPage = await startApp(page);
  taskManager = await logInPage.logIn();
  labelsTab = await taskManager.goToLabelsTab();
});

test('should content at least 1 task status', async () => {
  await expect(labelsTab.labelsTable.tableComponent).toBeTruthy();
  await expect.poll(async () => labelsTab.labelsTable.getItemsNumber()).toBeGreaterThan(0);
});

test('all labels on the page should have "Name"', async () => {
  const labelsData = await labelsTab.labelsTable.getTableData();

  labelsData.forEach((label) => {
    expect(label.Name).toBeTruthy();
  });
});

test('should be possible to delete labels from the table', async () => {
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

test('should be possible to delete all labels from the table', async () => {
  const labelsCount = await labelsTab.labelsTable.getItemsNumber();

  await labelsTab.labelsTable.selectAllItems();
  const selectedLabelsCount = await labelsTab.labelsTable.getSelectedItemsNumber();
  await expect(selectedLabelsCount).toBe(labelsCount);
  await labelsTab.labelsTable.deletSelectedItems();

  await expect(labelsTab.labelsTable.tableComponent).not.toBeVisible();
});

test('should create new labels', async () => {
  const labelsBefore = await labelsTab.labelsTable.getItemsNumber();
  const newLabelForm = await labelsTab.labelsTable.createNewItem(labelsTab.editableFields);

  await newLabelForm.fillInputByLabel('Name', labelData.name);
  const newLabelId = await newLabelForm.saveItem();
  await taskManager.goToLabelsTab();
  const labelsAfter = await labelsTab.labelsTable.getItemsNumber();
  const newLabelData = await labelsTab.labelsTable.getItemDataById(newLabelId);

  expect(newLabelData).toMatchObject({ Name: labelData.name });
  await expect(labelsAfter).toBe(labelsBefore + 1);
});

test('should not create label whithout data', async () => {
  const newLabelForm = await labelsTab.labelsTable.createNewItem(labelsTab.editableFields);

  await expect(newLabelForm.saveButton).toBeDisabled();
});

test('should edit label data', async () => {
  const labelEditForm = await labelsTab.labelsTable.editItemById('1', labelsTab.editableFields);

  await labelEditForm.fillInputByLabel('Name', labelData.name);
  await labelEditForm.saveItem();
  const editedLabel = await labelsTab.labelsTable.getItemDataById('1');

  await expect(editedLabel.Name).toEqual(labelData.name);
});
