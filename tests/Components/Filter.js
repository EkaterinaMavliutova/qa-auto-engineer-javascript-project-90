import BasePage from "../Pages/BasePage";

export default class Filter extends BasePage {
  constructor(page) {
    super(page);
    this.assigneeComboBox = this.page.getByRole('comboBox', { name: 'Assignee' });
    this.statusComboBox = this.page.getByRole('comboBox', { name: 'Status' });
    this.labelComboBox = this.page.getByRole('comboBox', { name: 'Label' });
    this.addFilterButton = this.page.getByRole('button', { name: 'Add filter' });
    this.removeAllFiltersButton = this.page.getByRole('menuitem').filter({ hasText: 'Remove all filters' });
  }

  async filterByAssignee(assigneeEmail) {
    await this.assigneeComboBox.click();
    await this.page.getByRole('option').filter({ hasText: `${assigneeEmail}` }).click();
  }

  async filterByStatus(statusName) {
    await this.statusComboBox.click();
    await this.page.getByRole('option').filter({ hasText: `${statusName}` }).click();
  }

  async filterByLabel(labelName) {
    await this.labelComboBox.click();
    await this.page.getByRole('option').filter({ hasText: `${labelName}` }).click();
  }

  async clearAllFilters() {
    await this.addFilterButton.click();
    await this.removeAllFiltersButton.click();
  }
}
