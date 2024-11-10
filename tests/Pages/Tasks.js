import Filter from "../Components/Filter";
import TaskForm from "../Components/TaskForm";
import BasePage from "./BasePage";

export default class Tasks extends BasePage {
  constructor(page) {
    super(page);
    this.createNewTaskButton = this.page.getByLabel('Create', { exact: true });
    this.editButton = this.page.getByRole('link', { name: 'Edit' });
    this.showButton = this.page.getByRole('link', { name: 'Show' });
    this.deleteButton = this.page.getByRole('button', { name: 'DELETE' });
    this.filters = new Filter(this.page);
    this.statuses = this.page.locator('css=div.MuiBox-root.css-1xphtog');
    this.tasks = this.page.getByRole('button').filter({ hasText: /Task/ });
    this.form = new TaskForm(this.page);
  }

  async findStatusByTitle(statusTitle) {
    return this.statuses.filter({ has: this.page.getByText(statusTitle) });
  }

  async findTaskByTitle(taskTitle) {
    const title = new RegExp(`^${taskTitle}$`, 'i');
    return await this.page.getByRole('button').filter({ has: this.page.getByText(title) });
  }

  async getTaskDataByTitle(taskTitle) {
    const targetTask = await this.findTaskByTitle(taskTitle);
    const status = await this.statuses.filter({ has: targetTask }).locator('css=h6').textContent();
    await targetTask.locator(this.showButton).click();
    const id = await this.page.locator('css=span.ra-field-id > span').textContent();
    const assigneeEmail = await this.page.locator('css=div.MuiStack-root > span').getByText(/\w@\w.\w/).textContent();
    const title = taskTitle;
    const hasLabels = await this.page.locator('css=a span.MuiChip-label').nth(0).isVisible();
    let labels;
    
    if (hasLabels) {
      labels = await this.page.locator('css=a span.MuiChip-label').allTextContents();
    } else {
      labels = [];
    }
    await this.page.goBack();

    return {
      taskTitle,
      status,
      id,
      assigneeEmail,
      title,
      labels,
    };
  }

  async createNewTask() {
    await this.createNewTaskButton.click();
  }

  async editTaskByTitle(taskTitle) {
    const targetTask = await this.findTaskByTitle(taskTitle);
    await targetTask.locator(this.editButton).click();
  }

  async deleteTaskByTitle(taskTitle) {
    const targetTask = await this.findTaskByTitle(taskTitle);
    await targetTask.locator(this.showButton).click();
    await this.deleteButton.click();
  }

  async createDefaultTask({ status, assigneeEmail, title, labels }) {
    await this.createNewTask();
    await this.form.fillInAssignee(assigneeEmail);
    await this.form.fillInTitle(title);
    await this.form.fillInStatus(status);
    await this.form.fillInLabel(labels);
    await this.form.saveItem();
  }

  async dragAndDropTask(taskTitle, targetStatusTitle) {
    const sourceTask = await this.findTaskByTitle(taskTitle);
    const sourceTaskBoundingBox = await sourceTask.boundingBox();
    const targetStatus = await this.findStatusByTitle(targetStatusTitle);
    const targetStatusBoundingBox = await targetStatus.boundingBox();
    const sourceCoordinates = {
      x: sourceTaskBoundingBox.x + sourceTaskBoundingBox.width / 2,
      y: sourceTaskBoundingBox.y + sourceTaskBoundingBox.height / 2,
    };
    const targetCoordinates = {
      x: (targetStatusBoundingBox.x + targetStatusBoundingBox.width / 2) - sourceCoordinates.x,
      y: 0,
    };
    await sourceTask.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(1, 1);
    await this.page.mouse.move(targetCoordinates.x, targetCoordinates.y);
    await this.page.mouse.up();
    await targetStatus.hover();
  }
}
