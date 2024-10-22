export default class Form {
  constructor(page) {
    this.page = page;
    this.saveButton = this.page.getByRole('button', { name: 'SAVE' });
    this.showItemInfoButton = this.page.getByRole('link', { name: 'SHOW' });
    this.assignee = this.page.getByRole('comboBox', { name: 'Assignee' });
    this.title = this.page.getByRole('textBox', { name: 'Title' });
    this.content = this.page.getByRole('textBox', { name: 'Content' });
    this.status = this.page.getByRole('comboBox', { name: 'Status' });
    this.label = this.page.getByRole('comboBox', { name: 'Label' });
  }

  async getInputValueByLabel(label) {
    return await this[label].inputValue();
  }

  async saveItem() {
    await this.saveButton.click();
  }

  async fillInputByLabel(label, value) {
    const isComboBox = await this[label].getAttribute('role') === 'combobox';
    if (isComboBox) {
      await this[label].selectOption(value);
    } else {
      await this[label].fill(value);
    }
  }
}
