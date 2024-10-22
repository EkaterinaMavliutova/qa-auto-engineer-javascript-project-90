

export default class Filter {
  constructor(page) {
    this.page = page;
    this.assigneeComboBox = this.page.getByRole('comboBox', { name: 'Assignee' });
    this.statusComboBox = this.page.getByRole('comboBox', { name: 'Status' });
    this.labelComboBox = this.page.getByRole('comboBox', { name: 'Label' });
    this.addFilterButton = this.page.getByRole('button', { name: 'Add filter' });
    this.removeAllFiltersButton = this.page.getByRole('menuitem').filter({ hasText: 'Remove all filters' });
  }

  async filterByAssignee(assigneeEmail) {
    await this.assigneeComboBox.selectOption(assigneeEmail);
  }

  async filterByStatus(statusName) {
    await this.statusComboBox.selectOption(statusName);
  }

  async filterByLabel(labelName) {
    await this.labelComboBox.selectOption(labelName);
  }

  async clearAllFilters() {
    await this.addFilterButton.click();
    await this.removeAllFiltersButton.click();
  }
}
