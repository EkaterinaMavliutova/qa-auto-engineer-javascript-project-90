import BasePage from "../Pages/BasePage";

export default class Header extends BasePage {
  constructor(page) {
    super(page);
    this.profileButton = this.page.getByLabel(/profile/i);
    this.profileImage = this.profileButton.locator(this.page.getByRole('img'));
  }
}
