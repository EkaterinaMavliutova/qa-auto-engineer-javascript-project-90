import Table from '../Components/Table';

export default class Users {
  constructor(page) {
    this.page = page;
    this.usersTable = new Table(page);
    this.editableFields = ['Email', 'First name', 'Last name', 'Password'];
  }

  async createDefaultUser({ email, firstName, lastName }) {
    const newUserForm = await this.usersTable.createNewItem(this.editableFields);

    await newUserForm.fillInputByLabel('Email', email);
    await newUserForm.fillInputByLabel('First name', firstName);
    await newUserForm.fillInputByLabel('Last name', lastName);
    await newUserForm.saveItem();
  }
}
