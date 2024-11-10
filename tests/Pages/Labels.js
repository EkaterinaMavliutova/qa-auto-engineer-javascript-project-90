import Table from '../Components/Table';
import BasePage from './BasePage';
import Form from '../Components/Form';

export default class Labels extends BasePage {
  constructor(page) {
    super(page);
    this.labelsTable = new Table(page);
    this.editableFields = ['Name'];
    this.form = new Form(this.page, this.editableFields);
  }

  async createDefaultLabel({ name }) {
    await this.labelsTable.createNewItem(this.editableFields);

    await this.form.fillInputByLabel('Name', name);
    await  this.form.saveItem();
  }
}
