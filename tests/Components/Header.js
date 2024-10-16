export default class Header {
  constructor(page) {
    this.page = page;
    this.profileButton = this.page.getByLabel(/profile/i);
    this.profileImage = this.profileButton.locator(this.page.getByRole('img'));
  }
}
