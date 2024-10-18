export default class Form {
  constructor(page) {
    this.page = page;
    this.saveButton = this.page.getByRole('button', { name: 'SAVE' });
    this.showItemInfoButton = this.page.getByRole('link', { name: 'SHOW' });
    this.deleteButton = this.page.getByRole('button', { name: 'DELETE' });
    this.assigneeCombobox = this.page.getByRole('comboBox', { name: 'Assignee' });
    this.titleInput = this.page.getByRole('textBox', { name: 'Title' });
    this.titleInput = this.page.getByRole('textBox', { name: 'Content' });
    this.statusComboBox = this.page.getByRole('comboBox', { name: 'Status' });
    this.labelComboBox = this.page.getByRole('comboBox', { name: 'Label' });
  }

  async getInputValueByLabel(label) {
    return await this[label].inputValue(); //
  }

  async saveItem() { //
    await this.saveButton.click();
    const isNewItem = await this.showItemInfoButton.isVisible();

    if (isNewItem) {
      await this.showItemInfoButton.click();
      const newItemId = await this.page.locator('css=span.ra-field-id > span').textContent();

      return newItemId;
    }
  }

  async fillInputByLabel(label, value) { //
    await this[label].fill(value);
  }
}
