import BasePage from "../Pages/BasePage";

export default class Form extends BasePage {
  constructor(page, lables) {
    super(page);
    this.saveButton = this.page.getByRole('button', { name: /save/i });
    this.showItemInfoButton = this.page.getByRole('link', { name: /show/i });

    lables.forEach((label) => {
      this[label] = this.page.getByLabel(label);
    });
  }

  async getInputValueByLabel(label) {
    return await this[label].inputValue();
  }

  async saveItem() {
    await this.saveButton.click();
    const isNewItem = await this.showItemInfoButton.isVisible();

    if (isNewItem) {
      await this.showItemInfoButton.click();
      const newItemId = await this.page.locator('css=span.ra-field-id > span').textContent();

      return newItemId;
    }
  }

  async fillInputByLabel(label, value) {
    await this[label].fill(value);
  }
}
