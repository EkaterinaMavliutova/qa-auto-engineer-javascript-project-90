export default class Table {
  constructor(page) {
    this.page = page;
    this.createButton = this.page.getByLabel('Create');
    // this.exportButton = this.page.getByLabel('Export');
    this.deleteItemButton = this.page.getByLabel('Delete');
    this.selectedItemsCounter = this.page.getByRole('heading', { name: /selected/i });
    this.unselectButton = this.page.getByLabel('Unselect');
    this.itemCheckBox = this.page.getByTestId('CheckBoxOutlineBlankIcon');
    this.itemsCounter = this.page.getByText(/\d+-\d+ of \d+/); //.textContent();
    this.tableComponent = this.page.getByRole('table');
  }

  async clearItemsSelection() {
    await this.unselectButton.click();
  }

  async getItemsNumber() {
    const itemsCounterText = await this.itemsCounter.textContent();
    const itemsCountIndex = itemsCounterText.lastIndexOf(' ');
    const itemsCount = itemsCounterText.slice(itemsCountIndex + 1);

    return Number(itemsCount);
  }

  async getTableHeaders() {
    return await this.page.getByRole('columnheader').allTextContents();
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

// console.log('!!!!!!!!!', result)
    return result;
  }

  async selectUsersOnPage(usersNumber) {
    const rows = await this.page.getByRole('row').filter({ has: this.page.getByRole('cell') }).all();
    const usersOnPageCount = rows.length - 1;
    let usersToSelect = usersNumber >= usersOnPageCount ? usersOnPageCount : usersNumber;
    const selectedIds = [];
    const tableHeaders = await this.getTableHeaders();

    for (let i = 0; i < usersToSelect; i += 1) {
      let userToSelect = await rows[i];
      let userIdIndex = tableHeaders.findIndex((item) => item === 'Id');
      let userToSelectId = await userToSelect.getByRole('cell').nth(userIdIndex).textContent();
      await userToSelect.locator(this.page.getByRole('checkBox')).click();
      selectedIds.push(userToSelectId);
    }

    console.log('!!!!!!!!!!!!', selectedIds);
    return selectedIds;
  }

  async getSelectedItemsNumber() {
    const selectedItemsCounterText = await this.selectedItemsCounter.textContent();
    const selectedItemsCountIndex = selectedItemsCounterText.indexOf(' ');
    const selectedItemsCount = selectedItemsCounterText.slice(0, selectedItemsCountIndex);

    return Number(selectedItemsCount);
  }

}
