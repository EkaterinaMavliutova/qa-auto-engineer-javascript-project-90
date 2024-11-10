import Table from '../Components/Table';
import BasePage from './BasePage';
import Form from '../Components/Form';

export default class Users extends BasePage {
  constructor(page) {
    super(page);
    this.usersTable = new Table(this.page);
    this.editableFields = ['Email', 'First name', 'Last name', 'Password'];
    this.form = new Form(this.page, this.editableFields);
  }

  async createDefaultUser({ email, firstName, lastName }) {
    await this.usersTable.createNewItem(this.editableFields);
    await this.form.fillInputByLabel('Email', email);
    await this.form.fillInputByLabel('First name', firstName);
    await this.form.fillInputByLabel('Last name', lastName);
    await this.form.saveItem();
  }
}
