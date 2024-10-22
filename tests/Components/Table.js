import Form from "./Form";

export default class Table {
  constructor(page) {
    this.page = page;
    this.createButton = this.page.getByLabel('Create', { exact: true });
    this.deleteItemButton = this.page.getByLabel('Delete');
    this.selectedItemsCounter = this.page.getByRole('heading', { name: /selected/i });
    this.unselectButton = this.page.getByLabel('Unselect');
    this.itemCheckBox = this.page.getByRole('checkBox');
    this.itemsCounter = this.page.getByText(/\d+-\d+ of \d+/);
    this.tableComponent = this.page.getByRole('table');
    this.selectAllItemsCheckBox = this.page.getByRole('columnheader').locator(this.itemCheckBox);
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
    const tableData = await Promise.all(rows.map((item) => {
      return item.locator(this.page.getByRole('cell')).allTextContents();
    }));
    const result = tableData.map((item) => {
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

  async getItemDataById(itemIdString) {
    const itemsOnPage = await this.getTableData();
    const targetItemData = itemsOnPage.find((item) => item.Id === itemIdString);
    // console.log('!!!!!!!!!!!!tableData: ', itemsOnPage);
    // console.log('!!!!!!!!!!!!itemIdString: ', itemIdString);
    // console.log('!!!!!!!!!!!!targetItemData`: ', targetItemData);
    if (targetItemData) {
      return targetItemData;
    }

    return 'not found';
  }

  async selectItemsOnPage(itemsNumber) {
    const rows = await this.page.getByRole('row').filter({ has: this.page.getByRole('cell') }).all();
    const itemsOnPageCount = rows.length - 1;
    let itemsToSelect = itemsNumber >= itemsOnPageCount ? itemsOnPageCount : itemsNumber;
    const selectedIds = [];
    const tableHeaders = await this.getTableHeaders();

    for (let i = 0; i < itemsToSelect; i += 1) {
      let itemToSelect = await rows[i]; // await убрать???
      let itemIdIndex = tableHeaders.findIndex((item) => item === 'Id');
      let itemToSelectId = await itemToSelect.getByRole('cell').nth(itemIdIndex).textContent();
      await itemToSelect.locator(this.page.getByRole('checkBox')).click();
      selectedIds.push(itemToSelectId);
    }

    // console.log('!!!!!!!!!!!!', selectedIds);
    return selectedIds;
  }

  async getSelectedItemsNumber() {
    const selectedItemsCounterText = await this.selectedItemsCounter.textContent();
    const selectedItemsCountIndex = selectedItemsCounterText.indexOf(' ');
    const selectedItemsCount = selectedItemsCounterText.slice(0, selectedItemsCountIndex);

    return Number(selectedItemsCount);
  }

  async deletSelectedItems() {
    await this.deleteItemButton.click();
  }

  async findTableHeaderIndex(headerName) {
    const tableHeaders = await this.getTableHeaders();

    return tableHeaders.findIndex((item) => item === headerName);
  }

  async findItemById(idString) {
    const idHeaderIndex = await this.findTableHeaderIndex('Id');
    const rows = await this.page.getByRole('row').filter({ has: this.page.getByRole('cell') }).all();
    const rowsOnPageCount = rows.length - 1;
    // console.log('!!!!!!!!! rowsOnPageCount: ', rowsOnPageCount);
    let targetRowIndex;

    for (let i = 0; i <= rowsOnPageCount; i += 1) {
      let rowId = await rows[i].getByRole('cell').nth(idHeaderIndex).textContent();
      // console.log('i: ', i, 'rowId: ', rowId);
      if (rowId === idString) {
        targetRowIndex = i;
        break;
      }
    }
    // console.log('!!!!!!!!!!', targetRowIndex);
    if (targetRowIndex >= 0) {
      return rows[targetRowIndex].getByRole('cell').nth(idHeaderIndex);
    } else {
      return 'not found';
    } 
  }

  async selectAllItems() {
    await this.selectAllItemsCheckBox.click();
  }

  async createNewItem(editableFields) {
    await this.createButton.click();

    return new Form(this.page, editableFields);
  }

  async editItemById(itemIdString, editableFields) {
    const itemToEdit = await this.findItemById(itemIdString);
    await itemToEdit.click();

    return new Form(this.page, editableFields);
  }
}
