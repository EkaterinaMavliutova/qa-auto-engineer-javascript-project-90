import Table from '../Components/Table';

export default class TaskStatuses {
  constructor(page) {
    this.page = page;
    this.statusesTable = new Table(page);
    this.editableFields = ['Name', 'Slug'];
  }
}
