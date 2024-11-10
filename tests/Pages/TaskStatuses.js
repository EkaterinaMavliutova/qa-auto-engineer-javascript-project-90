import Table from '../Components/Table';
import BasePage from './BasePage';
import Form from '../Components/Form';

export default class TaskStatuses extends BasePage {
  constructor(page) {
    super(page);
    this.statusesTable = new Table(this.page);
    this.editableFields = ['Name', 'Slug'];
    this.form = new Form(this.page, this.editableFields);
  }

  async createDefaultStatus({ name, slug }) {
    await this.statusesTable.createNewItem(this.editableFields);

    await this.form.fillInputByLabel('Name', name);
    await this.form.fillInputByLabel('Slug', slug);
    await this.form.saveButton.click();
  }
}
