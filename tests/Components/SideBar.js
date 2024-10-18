export default class SideBar {
  constructor(page) {
    this.page = page;
    this.openButton = this.page.getByLabel('Open menu');
    this.tasksTab = this.page.getByRole('menuitem').filter({ hasText: 'Tasks' });
    this.usersTab = this.page.getByRole('menuitem').filter({ hasText: 'Users' });
    this.labelsTab = this.page.getByRole('menuitem').filter({ hasText: 'Labels' });
    this.taskStatusesTab = this.page.getByRole('menuitem').filter({ hasText: 'Task statuses' });
  }
}
