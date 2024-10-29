import { expect, test } from '@playwright/test';
import startApp from './utils/utils';

const taskData = {
  title: 'Task 20',
  assigneeEmail: 'jack@yahoo.com',
  content: 'Task 20 description',
  status: 'To Publish',
  labels: ['feature', 'task'],
};

let logInPage;
let taskManager;
let tasksTab;

test.beforeEach(async ({ page }) => {
  logInPage = await startApp(page);
  taskManager = await logInPage.logIn();
  tasksTab = await taskManager.goToTasksTab();
});

test('each status should content at least 1 task', async () => {
  const statuses = await tasksTab.statuses.all();

  for (const status of statuses) {
    const tasksInStatus = await status.locator(tasksTab.tasks).count();
    await expect(tasksInStatus).toBeGreaterThanOrEqual(1);
  }
});

test('should create new tasks', async () => {
  const newTaskForm = await tasksTab.createNewTask();

  await newTaskForm.fillInAssignee(taskData.assigneeEmail);
  await newTaskForm.fillInTitle(taskData.title);
  await newTaskForm.fillInContent(taskData.content);
  await newTaskForm.fillInStatus(taskData.status);
  await newTaskForm.fillInLabel(taskData.labels);
  await newTaskForm.saveItem();
  await taskManager.goToTasksTab();

  await expect(await tasksTab.getTaskDataByTitle(taskData.title)).toMatchObject({
    title: taskData.title,
    assigneeEmail: taskData.assigneeEmail,
    status: taskData.status,
  });
});

test('should not create task whithout data', async () => {
  const newTaskForm = await tasksTab.createNewTask();

  await expect(newTaskForm.saveButton).toBeDisabled();
});

test('should edit task data', async () => {
  const taskEditForm = await tasksTab.editTaskByTitle('Task 2');
  await taskEditForm.fillInTitle(taskData.title);
  await taskEditForm.saveItem();

  const editedTask = await tasksTab.getTaskDataByTitle(taskData.title);

  await expect(editedTask.title).toEqual(taskData.title);
});

test('should be possible to delete tasks', async () => {
  const taskToDeleteTitle = 'Task 2';

  await tasksTab.deleteTaskByTitle(taskToDeleteTitle);

  await expect(await tasksTab.findTaskByTitle(taskToDeleteTitle)).toHaveCount(0);
});

test('should be possible to drag tasks between statuses', async () => {
  const additionalTaskData = {
    title: 'Task 21',
    assigneeEmail: 'jack@yahoo.com',
    content: 'Task 21 description',
    status: 'Published',
    labels: ['feature', 'task'],
  };
  await tasksTab.createDefaultTask(taskData);
  await taskManager.goToTasksTab();
  await tasksTab.createDefaultTask(additionalTaskData);
  await taskManager.goToTasksTab();

  await tasksTab.dragAndDropTask(taskData.title, additionalTaskData.status);
  // const sourceTask = await tasksTab.findTaskByTitle(taskData.title);
  // const sourceTaskBoundingBox = await sourceTask.boundingBox();
  // const targetStatus = await tasksTab.findStatusByTitle(additionalTaskData.status);
  // const targetStatusBoundingBox = await targetStatus.boundingBox();
  // const sourceCoordinates = {
  //   x: sourceTaskBoundingBox.x + sourceTaskBoundingBox.width / 2,
  //   y: sourceTaskBoundingBox.y + sourceTaskBoundingBox.height / 2,
  // };
  // const targetCoordinates = {
  //   x: (targetStatusBoundingBox.x + targetStatusBoundingBox.width / 2) - sourceCoordinates.x,
  //   y: 0,
  // };
  // // await page.mouse.move(sourceCoordinates.x, sourceCoordinates.y);
  // await sourceTask.hover();
  // await page.mouse.down();
  // await page.mouse.move(1, 1);
  // await page.mouse.move(targetCoordinates.x, targetCoordinates.y);
  // await page.mouse.up();
  // await targetStatus.hover();
  const sourceTaskData = await tasksTab.getTaskDataByTitle(taskData.title);

  await expect(sourceTaskData.status).toEqual(additionalTaskData.status);
});

// test('drag and drop', async ({ page }) => {
//   const sourceTask = await tasksTab.findTaskByTitle('Task 2');
//   const sourceTaskCoordinates = await sourceTask.boundingBox();
//   const targetStatus = tasksTab.statuses.filter({ has: page.getByText('Published') })//.locator('css=div[data-rfd-droppable-context-id]');
//   const targetStatusCoordinates = await targetStatus.boundingBox();
//   await page.mouse.move(
//     (sourceTaskCoordinates.x + sourceTaskCoordinates.width / 2),
//       sourceTaskCoordinates.y + sourceTaskCoordinates.height / 2
//   );
//   // зажимаю левую кнопку мыши
//   await page.mouse.down();
//   await page.mouse.move(1, 1);
//   // перемещаю курсор к центру целевого элемента
//   await page.mouse.move(
//     (targetStatusCoordinates.x + targetStatusCoordinates.width / 2) - (sourceTaskCoordinates.x + sourceTaskCoordinates.width / 2),
//     targetStatusCoordinates.y
//   );
//   // отпускаю левую кнопку мыши
//   await page.mouse.up();
//   await targetStatus.hover();
   
//   const sourceTaskData = await tasksTab.getTaskDataByTitle('Task 2');
   
//   await expect(sourceTaskData.status).toBe('Published');
// });

test.describe('should be filtered', () => {
  const statusData = {
    name: 'Testing',
    slug: 'Testing',
  };

  const labelData = {
    name: 'test',
  }
  
  const userData = {
    email: 'testUser@test.com',
    firstName: 'User',
    lastName: 'Name',
  };

  const taskData = {
    status: statusData.name,
    assigneeEmail: userData.email,
    title: 'Task 100',
    labels: [labelData.name],
  };

  test.beforeEach(async () => {
    const usersTab = await taskManager.goToUsersTab();
    await usersTab.createDefaultUser(userData);
    const taskStatusesTab = await taskManager.goToTaskStatusesTab();
    await taskStatusesTab.createDefaultStatus(statusData);
    const labelsTab = await taskManager.goToLabelsTab();
    await labelsTab.createDefaultLabel(labelData);
    await taskManager.goToTasksTab();
    await tasksTab.createDefaultTask(taskData);
    await taskManager.goToTasksTab();
  });
  test('by assignee', async () => {
    await tasksTab.filters.filterByAssignee(taskData.assigneeEmail);

    const status = tasksTab.statuses;
    const tasksInStatus = status.locator(tasksTab.tasks);

    await expect(status).toHaveCount(1);
    await expect(status).toContainText(taskData.status);
    await expect(tasksInStatus).toHaveCount(1);
    await expect(tasksInStatus).toContainText(taskData.title);
  });

  test('by status', async () => {
    await tasksTab.filters.filterByStatus(taskData.status);

    const status = tasksTab.statuses;
    const tasksInStatus = status.locator(tasksTab.tasks);

    await expect(status).toHaveCount(1);
    await expect(status).toContainText(taskData.status);
    await expect(tasksInStatus).toHaveCount(1);
    await expect(tasksInStatus).toContainText(taskData.title);
  });

  test('by label', async () => {
    await tasksTab.filters.filterByLabel(labelData.name);

    const status = tasksTab.statuses;
    const tasksInStatus = status.locator(tasksTab.tasks);

    await expect(status).toHaveCount(1);
    await expect(status).toContainText(taskData.status);
    await expect(tasksInStatus).toHaveCount(1);
    await expect(tasksInStatus).toContainText(taskData.title);

    const filteredTaskData = await tasksTab.getTaskDataByTitle(taskData.title);
    await expect(filteredTaskData.labels).toMatchObject(taskData.labels);
  });
});
