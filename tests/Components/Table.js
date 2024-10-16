export default class Table {
  constructor(page) {
    this.page = page;
    this.createButton = this.page.getByLabel('Create');
    // this.exportButton = this.page.getByLabel('Export');
    this.deleteItemButton = this.page.getByLabel('Delete');
    this.selectedItemsLabel = this.page.getByRole('heading', { name: /selected/i });
    this.unselectButton = this.page.getByLabel('Unselect');
    this.itemCheckBox = this.page.getByTestId('CheckBoxOutlineBlankIcon');
    this.itemsCounter = this.page.getByText(/\d+-\d+ of \d+/); //.textContent();
    this.tableComponent = this.page.getByRole('table');
  }

  async clearItemsSelection() {
    await this.unselectButton.click();
  }

  async getItemsNumber() {
    const itemCounter = await this.itemsCounter.textContent();
    const itemCountIndex = itemCounter.lastIndexOf(' ');
    const itemCount = itemCounter.slice(itemCountIndex + 1)

    return Number(itemCount);
  }

  async getTableData() {
    const columnNames = await this.page.getByRole('columnheader').allTextContents();
    const rows = await this.page.getByRole('row').filter({ has: this.page.getByRole('cell') }).all();
    const usersData = await Promise.all(rows.map((item) => {
      return item.locator(this.page.getByRole('cell')).allTextContents();
    }));
    const result = usersData.map((item) => {
      return item.reduce((acc, value, index) => {
        if (columnNames[index]) {
          acc[columnNames[index]] = value;
        }

        return acc;
      }, {});
    });

console.log('!!!!!!!!!', result)
    // return columnNames;
    return result;
  }

}
