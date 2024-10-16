import TaskManager from "./TaskManager";

const userData = {
  userName: 'user name',
  password: 'secret',
};

export default class LogIn {
  constructor(page) {
    this.page = page;
    this.userNameInput = this.page.getByLabel('Username');
    this.passwordInput = this.page.getByLabel(/password/i);
    this.signInButton = this.page.getByRole('button', { name: /sign in/i });
    this.errorMessage = this.page.getByText(/The form is not valid. Please check for errors/i);
  }

  async logIn() {
    await this.userNameInput.fill(userData.userName);
    await this.passwordInput.fill(userData.password);
    await this.signInButton.click();

    return new TaskManager(this.page);
  }

  async tryToLogIn(whatInputToFill = '') {
    if (whatInputToFill === 'username') {
      await this.userNameInput.fill(userData.userName);
    }
    if (whatInputToFill === 'password') {
      await this.passwordInput.fill(userData.password);
    }
    await this.signInButton.click();

    return new TaskManager(this.page);
  }
};
