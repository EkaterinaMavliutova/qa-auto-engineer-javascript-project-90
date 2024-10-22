import Filter from "../Components/Filter";
import TaskForm from "../Components/TaskForm";

export default class Tasks {
  constructor(page) {
    this.page = page;
    this.createNewTaskButton = this.page.getByLabel('Create', { exact: true });
    this.editButton = this.page.getByRole('link', { name: 'Edit' });
    this.showButton = this.page.getByRole('link', { name: 'Show' });
    this.deleteButton = this.page.getByRole('button', { name: 'DELETE' });
    this.filters = new Filter(page);
    this.status = this.page.locator('css=div.MuiBox-root > h6');
  }

  async findTaskByTitle(taskTitle) {
    const title = new RegExp(`^${taskTitle}$`, 'i');
    return await this.page.getByRole('button').filter({ has: this.page.getByText(title) });
  }

  async getTaskDataByTitle(taskTitle) {
    const targetTask = await this.findTaskByTitle(taskTitle);
    const status = await this.page.locator('css=div.MuiBox-root.css-1xphtog').filter({ has: targetTask }).locator('css=h6').textContent();
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

    return new TaskForm(this.page);
  }

  async editTaskByTitle(taskTitle) {
    const targetTask = await this.findTaskByTitle(taskTitle);
    await targetTask.locator(this.editButton).click();

    return new TaskForm(this.page);
  }

  async deleteTaskByTitle(taskTitle) {
    const targetTask = await this.findTaskByTitle(taskTitle);
    await targetTask.locator(this.showButton).click();
    await this.deleteButton.click();
  }
}
