

export default class Filter {
  constructor(page) {
    this.page = page;
    this.assigneeComboBox = this.page.getByRole('comboBox', { name: 'Assignee' });
    this.statusComboBox = this.page.getByRole('comboBox', { name: 'Status' });
    this.labelComboBox = this.page.getByRole('comboBox', { name: 'Label' });
  }

  async filterByAssignee() {

  }

  async filterByStatus() {
    
  }

  async filterByLabel() {
    
  }

  async clearFilter(filterName) {

  }

  async clearAllFilters() {
    
  }
}
