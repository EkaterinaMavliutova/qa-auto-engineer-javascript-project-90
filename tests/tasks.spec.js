import { expect, test } from '@playwright/test';
import startApp from './utils';

let logInPage;
let taskManager;
let tasksTab;

const taskData = {
  title: 'Task 20',
  assigneeEmail: 'jack@yahoo.com',
  content: 'Task 20 description',
  status: 'To Publish',
  labels: ['feature', 'task'],
};

test.beforeEach(async ({ page }) => {
  logInPage = await startApp(page);
  taskManager = await logInPage.logIn();
  tasksTab = await taskManager.goToTasksTab();
});

test('should content at least 1 task', async () => {
  const task1Data = await tasksTab.getTaskDataByTitle('Task 2');
  // console.log('!!!!!!!!!!!! ', task1Data);
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
