import BasePage from "../Pages/BasePage";

export default class TaskForm extends BasePage {
  constructor(page) {
    super(page);
    this.saveButton = this.page.getByRole('button', { name: 'SAVE' });
    this.showItemInfoButton = this.page.getByRole('link', { name: 'SHOW' });
    this.assigneeSearchList = this.page.getByRole('comboBox', { name: 'Assignee' });
    this.titleTextBox = this.page.getByRole('textBox', { name: 'Title' });
    this.contentTextBox = this.page.getByRole('textBox', { name: 'Content' });
    this.statusDropDownList = this.page.getByRole('comboBox', { name: 'Status' });
    this.labelDropDownList = this.page.getByRole('comboBox', { name: 'Label' });
  }

  async getInputValueByLabel(label) {
    return await this[label].inputValue();
  }

  async saveItem() {
    await this.saveButton.click();
  }

  async fillInAssignee(value) {
    await this.assigneeSearchList.click();
    await this.assigneeSearchList.fill(value);
    await this.page.getByText(value).click();
  }

  async fillInTitle(value) {
    await this.titleTextBox.fill(value);
  }

  async fillInContent(value) {
    await this.contentTextBox.fill(value);
  }

  async fillInStatus(value) {
    await this.statusDropDownList.click();
    await this.page.getByRole('option').filter({ hasText: `${value}` }).click();
  }

  async fillInLabel(values) {
    await this.labelDropDownList.click();

    for (let i = 0; i < values.length; i += 1) {
      await this.page.getByRole('option').filter({ hasText: `${values[i]}` }).click();
    }
    await this.page.getByRole('listbox').press('Tab');
  }
}
