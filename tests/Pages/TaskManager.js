import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import Users from './Users';
import TaskStatuses from './TaskStatuses';
import Labels from './Labels';
import Tasks from './Tasks';

export default class TaskManager {
  constructor(page) {
    this.page = page;
    this.header = new Header(page);
    this.sideBar = new SideBar(page);
    this.fillerMessage = this.page.getByText('Lorem ipsum sic dolor amet...');
  }

  async logOut() {
    await this.header.profileButton.click();
    await this.page.getByRole('menuitem').filter({ hasText: 'Logout' }).click();
  }

  async goToUsersTab() {
    await this.sideBar.usersTab.click();
    return new Users(this.page);
  }

  async goToLabelsTab() {
    await this.sideBar.labelsTab.click();

    return new Labels(this.page);
  }

  async goToTaskStatusesTab() {
    await this.sideBar.taskStatusesTab.click();

    return new TaskStatuses(this.page);
  }

  async goToTasksTab() {
    await this.sideBar.tasksTab.click();

    return new Tasks(this.page);
  }

};


