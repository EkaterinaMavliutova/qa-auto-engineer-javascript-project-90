import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import Users from './Users';
import TaskStatuses from './TaskStatuses';
import Labels from './Labels';
import Tasks from './Tasks';
import BasePage from './BasePage';
import LogIn from './LogIn';

export default class TaskManager extends BasePage {
  constructor(page) {
    super(page);
    this.header = new Header(this.page);
    this.sideBar = new SideBar(this.page);
    this.fillerMessage = this.page.getByText('Lorem ipsum sic dolor amet...');
    this.usersTab = new Users(this.page);
    this.labelsTab = new Labels(this.page);
    this.taskStatusesTab = new TaskStatuses(this.page);
    this.tasksTab = new Tasks(this.page);
    this.logInPage = new LogIn(this.page);
  }

  async logOut() {
    await this.header.profileButton.click();
    await this.page.getByRole('menuitem').filter({ hasText: 'Logout' }).click();
  }
};


