import Table from '../Components/Table';

export default class Labels {
  constructor(page) {
    this.page = page;
    this.labelsTable = new Table(page);
    this.editableFields = ['Name'];
  }

  async createDefaultLabel({ name }) {
    const newLabelForm = await this.labelsTable.createNewItem(this.editableFields);

    await newLabelForm.fillInputByLabel('Name', name);
    await newLabelForm.saveItem();
  }
}
