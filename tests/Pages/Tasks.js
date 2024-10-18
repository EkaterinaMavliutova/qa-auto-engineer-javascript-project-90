import Filter from "../Components/Filter";
import TaskForm from "../Components/TaskForm";

export default class Labels {
  constructor(page) {
    this.page = page;
    this.createNewTaskButton = this.page.getByLabel('Create', { exact: true });
    this.editButton = this.page.getByRole('link', { name: 'Edit' });
    this.showButton = this.page.getByRole('link', { name: 'Show' });    
    this.fiters = new Filter(page);
    this.form = new TaskForm(page);

  }

  async findTaskByName(taskName) {

  }

  async getTaskDataByName(taskName) {

  }

  async createNewTask() {

  }

  async editTask() {

  }
}
