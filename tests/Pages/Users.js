import Table from '../Components/Table';

export default class Users {
  constructor(page) {
    this.page = page;
    this.usersTable = new Table(page);
    this.editableFields = ['Email', 'First name', 'Last name', 'Password'];
  }
}
