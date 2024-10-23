import Table from '../Components/Table';

export default class TaskStatuses {
  constructor(page) {
    this.page = page;
    this.statusesTable = new Table(page);
    this.editableFields = ['Name', 'Slug'];
  }

  async createDefaultStatus({ name, slug }) {
    const newStatusForm = await this.statusesTable.createNewItem(this.editableFields);

    await newStatusForm.fillInputByLabel('Name', name);
    await newStatusForm.fillInputByLabel('Slug', slug);
    await newStatusForm.saveButton.click();
  }
}
