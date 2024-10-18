import Table from '../Components/Table';

export default class Labels {
  constructor(page) {
    this.page = page;
    this.labelsTable = new Table(page);
    this.editableFields = ['Name'];
  }
}
